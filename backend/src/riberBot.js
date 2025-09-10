import Cache from "./utils/cache.js";
import logger from "./utils/logger.js";
import indexes from "./utils/indexes.js";
import usersRepository from "./repositories/usersRepository.js";
import mailer from "./utils/email.js";
import telegram from "./utils/telegram.js";

const LOGS = process.env.RIBERBOT_LOGS === "true";
const INTERVAL = parseInt(process.env.AUTOMATION_INTERVAL || 0);

export default class RiberBot {
  static instance;

  static getInstance(automations = []) {
    if (!RiberBot.instance) RiberBot.instance = new RiberBot(automations);
    return RiberBot.instance;
  }

  constructor(automations) {
    this.cache = new Cache();

    this.BRAIN = {};
    this.BRAIN_INDEX = {};
    this.BRAIN_LOCK = {};

    if (!automations || !automations.length) return;

    setTimeout(() => {
      automations.filter((a) => a.isActive).map((a) => this.updateBrain(a));
      logger(
        "riberBot -",
        `O Cérebro do RiberBot foi iniciado para o usuário ${automations[0].userId}!`
      );
    }, 1000);
  }

  setLocked(automationId, value) {
    if (Array.isArray(automationId))
      return automationId.map((id) => (this.BRAIN_LOCK[id] = value));
    return (this.BRAIN_LOCK[automationId] = value);
  }

  isLocked(automationId) {
    if (Array.isArray(automationId))
      return automationId.some((id) => this.BRAIN_LOCK[id] === true);
    return this.BRAIN_LOCK[automationId] === true;
  }

  updateBrain(automation) {
    if (
      !automation.isActive ||
      (!automation.openCondition && !automation.closeCondition)
    )
      return;

    automation = this.getLightAutomation(automation);

    this.BRAIN[automation.id] = automation;

    const indexes = automation.isOpened
      ? automation.closeIndexes
      : automation.openIndexes;
    if (!indexes) return;

    this.updateBrainIndex(indexes.split(","), automation);

    if (automation.logs)
      logger(
        "A-" + automation.id,
        `Automação adicionada ao CÉREBRO #${automation.id}`
      );
  }

  updateBrainIndex(indexOrIndexes, automation) {
    if (!indexOrIndexes || !automation) return;

    if (Array.isArray(indexOrIndexes)) {
      indexOrIndexes = indexOrIndexes.filter((ix) => ix);
      if (!indexOrIndexes.length) return;
      indexOrIndexes.map((ix) => this.updateBrainIndex(ix, automation));
    } else {
      if (!this.BRAIN_INDEX[indexOrIndexes])
        this.BRAIN_INDEX[indexOrIndexes] = [automation.id];
      else if (!this.BRAIN_INDEX[indexOrIndexes].includes(automation.id))
        this.BRAIN_INDEX[indexOrIndexes].push(automation.id);
    }
  }

  deleteBrain(automation) {
    try {
      this.setLocked(automation.id, true);

      this.deleteBrainIndex(
        `${automation.openIndexes},${automation.closeIndexes}`,
        automation.id
      );
      delete this.BRAIN[automation.id];

      if (automation.logs)
        logger(
          "A-" + automation.id,
          `Automação removida do CÉREBRO #${automation.id}`
        );
    } finally {
      this.setLocked(automation.id, false);
    }
  }

  deleteBrainIndex(indexes, automationId) {
    if (typeof indexes === "string") indexes = indexes.split(",");
    indexes = indexes.filter((ix) => ix);
    indexes.map((ix) => {
      if (!this.BRAIN_INDEX[ix] || !this.BRAIN_INDEX[ix].length) return;

      const start = this.BRAIN_INDEX[ix].findIndex((id) => id === automationId);
      if (start === -1) return;
      this.BRAIN_INDEX[ix].splice(start, 1);
    });
  }

  getLightAutomation(automation) {
    if (automation.toJSON) automation = automation.toJSON();
    if (automation.get) automation = automation.get({ plain: true });

    delete automation.createdAt;
    delete automation.updatedAt;

    return automation;
  }

  getBrain() {
    return { ...this.BRAIN };
  }

  getBrainIndexes() {
    return { ...this.BRAIN_INDEX };
  }

  static FIAT_COINS = ["BRL", "EUR", "GBP", "JPY", "AUD", "NGN", "UAH", "TRY"];

  static DOLLAR_COINS = ["USD", "USDT", "USDC", "TUSD", "FDUSD", "UST"];

  async getStableConversion(baseAsset, quoteAsset, baseQty) {
    if (RiberBot.DOLLAR_COINS.includes(baseAsset)) return baseQty;

    const ticker = await this.getMemory(
      baseAsset + quoteAsset,
      indexes.indexKeys.TICKER
    );
    if (ticker && ticker.current)
      return parseFloat(baseQty) * ticker.current.close;
    return 0;
  }

  async getFiatConversion(stablecoin, fiatCoin, fiatQty) {
    const ticker = await this.getMemory(
      stablecoin + fiatCoin,
      indexes.indexKeys.TICKER
    );
    if (ticker && ticker.current)
      return parseFloat(fiatQty) / ticker.current.close;
    return 0;
  }

  async tryUsdConversion(baseAsset, baseQty) {
    if (RiberBot.DOLLAR_COINS.includes(baseAsset)) return baseQty;
    if (RiberBot.FIAT_COINS.includes(baseAsset))
      return this.getFiatConversion("USDT", baseAsset, baseQty);

    for (let i = 0; i < RiberBot.DOLLAR_COINS.length; i++) {
      const converted = await this.getStableConversion(
        baseAsset,
        RiberBot.DOLLAR_COINS[i],
        baseQty
      );
      if (converted > 0) return converted;
    }

    return 0;
  }

  async tryFiatConversion(baseAsset, baseQty, fiat) {
    if (fiat) fiat = fiat.toUpperCase();
    if (RiberBot.FIAT_COINS.includes(baseAsset) && baseAsset === fiat)
      return baseQty;

    const usd = this.tryUsdConversion(baseAsset, baseQty);
    if (fiat === "USD" || !fiat) return usd;

    let ticker = await this.getMemory("USDT" + fiat, indexes.indexKeys.TICKER);
    if (ticker && ticker.current) return usd * ticker.current.close;

    ticker = await this.getMemory(fiat + "USDT", indexes.indexKeys.TICKER);
    if (ticker && ticker.current) return usd / ticker.current.close;

    return usd;
  }

  buildMemoryKey(symbol, index, interval = undefined) {
    const indexKey = interval ? `${index}_${interval}` : index;
    return `${symbol}:${indexKey}`;
  }

  async setCache(symbol, index, interval, value, executeAutomations = true) {
    const memoryKey = this.buildMemoryKey(symbol, index, interval);

    if (LOGS)
      logger(
        "riberBot -",
        `RiberBot memória atualizada: ${memoryKey} => ${JSON.stringify(value)}`
      );

    this.cache.set(memoryKey, value);

    if (executeAutomations) return this.updatedMemory(memoryKey);
  }

  async updatedMemory(memoryKey) {
    const automations = this.findAutomations(memoryKey) || [];
    if (!automations || !automations.length) {
      if (LOGS)
        logger(
          "riberBot",
          `RiberBot não possui automações para chave de memória ${memoryKey}`
        );
      return false;
    }

    const results = [];
    for (let i = 0; i < automations.length; i++) {
      const automation = automations[i];
      if (this.isLocked(automation.id)) continue;

      const result = await this.evalDecision(memoryKey, automation);
      if (result) results.push(result);
    }

    if (!results || !results.length) return false;

    return results.flat();
  }

  async evalDecision(memoryKey, automation) {
    if (!automation || !memoryKey) return false;

    try {
      const isValid = await this.checkActivation(automation, memoryKey);
      if (!isValid) return false;

      if (this.isLocked(automation.id)) return false;
      this.setLocked(automation.id, true);

      if (LOGS || automation.logs)
        logger(
          "A-" + automation.id,
          `RiberBot avaliou uma condição em '${automation.name}'`
        );

      let result = {};
      const user = await usersRepository.getUser(automation.userId);

      if (
        (automation.isOpened && automation.closeTemplateId) ||
        (!automation.isOpened && automation.openTemplateId)
      ) {
        //executar ordens
        //atualizar automação
        result = {
          type: "success",
          text: "Ordem enviada!",
          automationId: automation.id,
        };
      }

      const notificationResult = await this.sendNotifications(
        user,
        automation,
        result
      );
      if (!result) result = notificationResult;

      if (automation.logs && result)
        logger(
          "A-" + automation.id,
          `Result for '${automation.name}' was ${JSON.stringify(
            result
          )} at ${new Date()}`
        );

      result.automationId = automation.id;

      setTimeout(() => {
        this.setLocked(automation.id, false);
      }, INTERVAL);

      return result || false;
    } catch (err) {
      if (automation.logs) logger("A-" + automation.id, err);
      return {
        type: "error",
        text: `Erro em evalDecision para '${automation.name}': ${err.message}`,
        automationId: automation.id,
      };
    }
  }

  async sendNotifications(user, automation, result) {
    if (!automation.sendNotification) return result;

    if (user.telegramChat && process.env.TELEGRAM_TOKEN) {
      const telegramResult = await this.sendTelegram(
        user.telegramChat,
        automation,
        result.text + "\n" + automation.name
      );
      if (!result) result = telegramResult;
    }

    if (user.email && process.env.SMTP_SERVER) {
      const emailResult = await this.sendEmail(
        user.email,
        automation,
        result.text + "\n" + automation.name
      );
      if (!result) result = emailResult;
    }

    return result;
  }

  async sendTelegram(telegramChat, automation, message) {
    const defaultMessage = automation.name + " disparou!";
    await telegram(telegramChat, message ? message : defaultMessage);
    if (automation.logs)
      logger(
        "A-" + automation.id,
        `Telegram enviado pela automação '${automation.name}'!`
      );
    return {
      text: `Telegram enviado pela automação '${automation.name}'!`,
      type: "success",
      automationId: automation.id,
    };
  }

  async sendEmail(email, automation, message) {
    const defaultMessage = automation.name + " disparou!";
    await mailer(message ? message : defaultMessage, email, defaultMessage);
    if (automation.logs)
      logger(
        "A-" + automation.id,
        `E-mail enviado pela automação '${automation.name}'!`
      );
    return {
      text: `E-mail enviado pela automação '${automation.name}'!`,
      type: "success",
      automationId: automation.id,
    };
  }

  async checkActivation(automation, memoryKey) {
    let indexes = automation.isOpened
      ? automation.closeIndexes
      : automation.openIndexes;
    if (!indexes) return true;

    indexes = indexes.split(",").filter((ix) => ix);
    if (!indexes || !indexes.length) return true;

    const MEMORY = await this.cache.getAll(...indexes);
    const hasVariablesInMemory = indexes.every(
      (ix) => MEMORY[ix] !== null && MEMORY[ix] !== undefined
    );
    if (!hasVariablesInMemory) return false;

    const originalCondition = automation.isOpened
      ? automation.closeCondition
      : automation.openCondition;
    const invertedCondition = this.shouldntInvert(automation, memoryKey)
      ? ""
      : this.invertCondition(memoryKey, originalCondition);

    const evalCondition =
      originalCondition + (invertedCondition ? " && " + invertedCondition : "");

    if (LOGS || automation.logs)
      logger(
        "A-" + automation.id,
        `RiberBot tentando analizar:\n${evalCondition} at ${automation.name}`
      );

    return evalCondition
      ? Function("MEMORY", "return " + evalCondition)(MEMORY)
      : true;
  }

  invertCondition(memoryKey, condition) {
    const conds = condition.split(" && ");
    const condToInvert = conds.find(
      (c) => c.indexOf(memoryKey) !== -1 && c.indexOf("current") !== -1
    );
    if (!condToInvert) return "";

    if (condToInvert.indexOf(">=") !== -1)
      return condToInvert.replace(">=", "<").replace(/current/g, "previous");
    if (condToInvert.indexOf("<=") !== -1)
      return condToInvert.replace("<=", ">").replace(/current/g, "previous");
    if (condToInvert.indexOf(">") !== -1)
      return condToInvert.replace(">", "<").replace(/current/g, "previous");
    if (condToInvert.indexOf("<") !== -1)
      return condToInvert.replace("<", ">").replace(/current/g, "previous");
    if (condToInvert.indexOf("!") !== -1)
      return condToInvert.replace("!", "=").replace(/current/g, "previous");
    if (condToInvert.indexOf("==") !== -1)
      return condToInvert.replace("==", "!=").replace(/current/g, "previous");
    return "";
  }

  shouldntInvert(automation, memoryKey) {
    //para desabilitar o double check: apenas return true
    if (!automation.openTemplateId && !automation.closeTemplateId) return false;

    return (
      memoryKey.indexOf(`:${indexes.indexKeys.LAST_ORDER}`) !== -1 ||
      memoryKey.indexOf(`:${indexes.indexKeys.AUTO_ORDER}`) !== -1 ||
      memoryKey.indexOf(`:${indexes.indexKeys.LAST_CANDLE}`) !== -1 ||
      memoryKey.indexOf(`:${indexes.indexKeys.PREVIOUS_CANDLE}`) !== -1
    );
  }

  findAutomations(memoryKey) {
    const ids = this.BRAIN_INDEX[memoryKey];
    if (!ids || !ids.length) return [];
    return [...new Set(ids)].map((id) => this.BRAIN[id]).filter((a) => a) || [];
  }

  async getMemory(symbolOrKey, index = undefined, interval = undefined) {
    if (symbolOrKey && index) {
      const memoryKey = this.buildMemoryKey(symbolOrKey, index, interval);
      return this.cache.get(memoryKey);
    } else if (symbolOrKey) return this.cache.get(symbolOrKey);
    else return this.cache.search();
  }

  async updateTickerMemory(symbol, index, ticker, executeAutomations = true) {
    ticker.priceChange = parseFloat(ticker.priceChange);
    ticker.percentChange = parseFloat(ticker.percentChange);
    ticker.averagePrice = parseFloat(ticker.averagePrice);
    ticker.prevClose = parseFloat(ticker.prevClose);
    ticker.close = parseFloat(ticker.close);
    ticker.closeQty = parseFloat(ticker.closeQty);
    ticker.bestBid = parseFloat(ticker.bestBid);
    ticker.bestBidQty = parseFloat(ticker.bestBidQty);
    ticker.bestAsk = parseFloat(ticker.bestAsk);
    ticker.bestAskQty = parseFloat(ticker.bestAskQty);
    ticker.open = parseFloat(ticker.open);
    ticker.high = parseFloat(ticker.high);
    ticker.low = parseFloat(ticker.low);
    ticker.volume = parseFloat(ticker.volume);
    ticker.quoteVolume = parseFloat(ticker.quoteVolume);

    delete ticker.eventTime;
    delete ticker.eventType;
    delete ticker.lastTradeId;
    delete ticker.firstTradeId;
    delete ticker.numTrades;
    delete ticker.closeTime;
    delete ticker.openTime;
    delete ticker.symbol;

    const currentMemory = await this.getMemory(symbol, index);

    const newMemory = {};
    newMemory.previous = currentMemory ? currentMemory.current : ticker;
    newMemory.current = ticker;

    return this.setCache(symbol, index, null, newMemory, executeAutomations);
  }

  async updateMemory(
    symbol,
    index,
    interval,
    value,
    executeAutomations = true
  ) {
    if (value === undefined || value === null) return false;
    if (value.toJSON) value = value.toJSON();
    if (value.get) value = value.get({ plain: true });

    if (
      index.startsWith(indexes.indexKeys.LAST_ORDER) ||
      index.startsWith(indexes.indexKeys.AUTO_ORDER)
    )
      return this.updateOrderMemory(index, value, executeAutomations);
    else if (index === indexes.indexKeys.TICKER)
      return this.updateTickerMemory(symbol, index, value, executeAutomations);
    else
      return this.setCache(symbol, index, interval, value, executeAutomations);
  }

  updateOrderMemory(index, order, executeAutomations) {
    if (order.toJSON) order = order.toJSON();
    if (order.get) order = order.get({ plain: true });

    const symbol = order.symbol;

    delete order.id;
    delete order.symbol;
    delete order.automationId;
    delete order.userId;
    delete order.orderId;
    delete order.transactTime;
    delete order.commission;
    delete order.obs;
    delete order.createdAt;
    delete order.updatedAt;
    delete order.automation;

    order.limitPrice = order.limitPrice ? parseFloat(order.limitPrice) : null;
    order.stopPrice = order.stopPrice ? parseFloat(order.stopPrice) : null;
    order.trailingDelta = order.trailingDelta
      ? parseInt(order.trailingDelta)
      : null;
    order.avgPrice = order.avgPrice ? parseFloat(order.avgPrice) : null;
    order.net = order.net ? parseFloat(order.net) : null;
    order.quantity = order.quantity ? parseFloat(order.quantity) : null;

    return this.setCache(symbol, index, null, order, executeAutomations);
  }

  async updateAllMemory(
    symbol,
    calculatedIndexes,
    interval,
    executeAutomations = true
  ) {
    const keyValues = {};
    Object.keys(calculatedIndexes).forEach((index) => {
      const memoryKey = this.buildMemoryKey(symbol, index, interval);
      keyValues[memoryKey] = calculatedIndexes[index];
    });

    this.cache.setAll(keyValues);

    const keys = Object.keys(keyValues);
    const results = [];

    for (let i = 0; i < keys.length; i++) {
      const memoryKey = keys[i];
      const result = await this.updatedMemory(memoryKey);
      if (result) results.push(result);
    }

    if (LOGS)
      logger(
        "riberBot -",
        `RiberBot memória atualizada: ${symbol}_${interval} => ${JSON.stringify(
          calculatedIndexes
        )} => execute? ${executeAutomations}`
      );

    return results;
  }

  deleteMemory(symbol, index, interval) {
    const memoryKey = this.buildMemoryKey(symbol, index, interval);
    return this.cache.unset(memoryKey);
  }
}
