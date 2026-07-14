import Cache from "./utils/cache.js";
import logger from "./utils/logger.js";
import indexes from "./utils/indexes.js";
import usersRepository from "./repositories/usersRepository.js";
import mailer from "./utils/email.js";
import telegram from "./utils/telegram.js";
import automationsRepository from "./repositories/automationsRepository.js";
import symbolsRepository from "./repositories/symbolsRepository.js";
import ordersRepository from "./repositories/ordersRepository.js";
import Exchange from "./utils/exchange.js";
import orderTemplatesRepository from "./repositories/orderTemplatesRepository.js";
import gridsRepository from "./repositories/gridsRepository.js";
import db from "./db.js";

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
        `O Cérebro do RiberBot foi iniciado para o usuário ${automations[0].userId}!`,
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
        `Automação adicionada ao CÉREBRO #${automation.id}`,
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
        automation.id,
      );
      delete this.BRAIN[automation.id];

      if (automation.logs)
        logger(
          "A-" + automation.id,
          `Automação removida do CÉREBRO #${automation.id}`,
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

  getLightAutomation(originalAutomation) {
    let automation = { ...originalAutomation };
    if (originalAutomation.toJSON) automation = originalAutomation.toJSON();
    if (originalAutomation.get)
      automation = originalAutomation.get({ plain: true });

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
      indexes.indexKeys.TICKER,
    );
    if (ticker && ticker.current)
      return parseFloat(baseQty) * ticker.current.close;
    return 0;
  }

  async getFiatConversion(stablecoin, fiatCoin, fiatQty) {
    const ticker = await this.getMemory(
      stablecoin + fiatCoin,
      indexes.indexKeys.TICKER,
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
        baseQty,
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
        `RiberBot memória atualizada: ${memoryKey} => ${JSON.stringify(value)}`,
      );

    await this.cache.set(memoryKey, value);

    if (executeAutomations) return this.updatedMemory(memoryKey);
  }

  async updatedMemory(memoryKey) {
    const automations = this.findAutomations(memoryKey) || [];

    if (!automations || !automations.length) {
      if (LOGS)
        logger(
          "riberBot",
          `RiberBot não possui automações para chave de memória ${memoryKey}`,
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

  isValidQuoteOrder(orderTemplate) {
    return (
      orderTemplate.type === ordersRepository.orderTypes.MARKET &&
      (["MIN_NOTIONAL", "QUOTE_QTY"].includes(orderTemplate.quantity) ||
        (orderTemplate.side === "BUY" &&
          orderTemplate.quantity === "MAX_WALLET"))
    );
  }

  async calcQuoteQty(orderTemplate, symbolObj) {
    if (
      orderTemplate.type !== ordersRepository.orderTypes.MARKET ||
      parseFloat(orderTemplate.quantity)
    )
      throw new Error(
        `Somente pedidos no MARKET podem calcular a quantidade cotada.`,
      );

    const multiplier = orderTemplate.quantityMultiplier;

    if (orderTemplate.quantity === "MAX_WALLET") {
      if (orderTemplate.side !== "BUY")
        throw new Error(
          `Somente ordens de COMPRA A MERCADO podem calcular a quantidade cotada com SALDO DISPONIVEL.`,
        );

      const asset = parseFloat(
        await this.cache.get(
          `${symbolObj.quote}:${indexes.indexKeys.WALLET}_${orderTemplate.userId}`,
        ),
      );
      if (!asset)
        throw new Error(
          `Não há ${symbolObj.quote} na sua carteira para fazer uma ordem de compra.`,
        );

      return (parseFloat(asset) * (multiplier > 1 ? 1 : multiplier)).toFixed(
        symbolObj.quotePrecision,
      );
    } else if (orderTemplate.quantity === "MIN_NOTIONAL") {
      return (
        parseFloat(symbolObj.minNotional) * (multiplier < 1 ? 1 : multiplier)
      ).toFixed(symbolObj.quotePrecision);
    } else if (orderTemplate.quantity === "QUOTE_QTY") return multiplier;
    else
      throw new Error(
        `Quantidade para esse modelo de ordem inválido. ${orderTemplate.quantity}`,
      );
  }

  async parsePrice(symbol, price, userId, automationId) {
    switch (price) {
      case "AUTO_ORDER_AVG": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.AUTO_ORDER}_${automationId}`,
        );
        return memory.avgPrice;
      }
      case "AUTO_ORDER_LIMIT": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.AUTO_ORDER}_${automationId}`,
        );
        return memory.limitPrice || memory.avgPrice;
      }
      case "AUTO_ORDER_STOP": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.AUTO_ORDER}_${automationId}`,
        );
        return memory.stopPrice || memory.avgPrice;
      }
      case "LAST_ORDER_AVG": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.LAST_ORDER}_${userId}`,
        );
        return memory.avgPrice;
      }
      case "LAST_ORDER_LIMIT": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.LAST_ORDER}_${userId}`,
        );
        return memory.limitPrice || memory.avgPrice;
      }
      case "LAST_ORDER_STOP": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.LAST_ORDER}_${userId}`,
        );
        return memory.stopPrice || memory.avgPrice;
      }
      case "TICKER_PRICE": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.TICKER}`,
        );
        return memory.current.close;
      }
      case "TICKER_HIGH": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.TICKER}`,
        );
        return memory.current.high;
      }
      case "TICKER_LOW": {
        const memory = await this.cache.get(
          `${symbol}:${indexes.indexKeys.TICKER}`,
        );
        return memory.current.low;
      }
    }
  }

  async calcPrice(orderTemplate, symbolObj, isStopPrice, automationId) {
    const tickSize = parseFloat(symbolObj.tickSize);
    let newPrice, factor;

    if (ordersRepository.LIMIT_TYPES.includes(orderTemplate.type)) {
      try {
        if (!isStopPrice) {
          if (parseFloat(orderTemplate.limitPrice))
            return orderTemplate.limitPrice;
          newPrice = await this.parsePrice(
            orderTemplate.symbol,
            orderTemplate.limitPrice,
            orderTemplate.userId,
            automationId,
          );
          newPrice *= orderTemplate.limitPriceMultiplier || 1;
        } else {
          if (parseFloat(orderTemplate.stopPrice))
            return orderTemplate.stopPrice;
          newPrice = await this.parsePrice(
            orderTemplate.symbol,
            orderTemplate.stopPrice,
            orderTemplate.userId,
            automationId,
          );
          newPrice *= orderTemplate.stopPriceMultiplier || 1;
        }
      } catch (err) {
        if (isStopPrice)
          throw new Error(
            `Não é possível calcular o preço de parada: ${orderTemplate.stopPrice} x ${orderTemplate.stopPriceMultiplier}. Err: ${err.message}`,
          );
        else
          throw new Error(
            `Não é possível calcular o preço a limite: ${orderTemplate.limitPrice} x ${orderTemplate.limitPriceMultiplier}. Err: ${err.message}`,
          );
      }
    } else {
      const memory = await this.cache.get(
        `${orderTemplate.symbol}:${indexes.indexKeys.TICKER}`,
      );
      if (!memory)
        throw new Error(
          `Não é possível calcular o preço a MARKET. OT: ${orderTemplate.id}, Preço de parada: ${isStopPrice}. Sem saldo.`,
        );

      newPrice = memory.current.close;
      newPrice *= isStopPrice
        ? orderTemplate.stopPriceMultiplier
        : orderTemplate.limitPriceMultiplier;
    }

    factor = Math.floor(newPrice / tickSize);
    const price = (factor * tickSize).toFixed(symbolObj.quotePrecision);

    if (!isFinite(price) || !price)
      throw new Error(
        `Não é possível calcular o preço: OT: ${orderTemplate.id}, $: ${price}, é Stop: ${isStopPrice}`,
      );

    return price;
  }

  async hasEnoughAssets(userId, symbolObj, order, price) {
    let hasEnough = false;
    const qty = parseFloat(order.quantity);

    if (order.side === "BUY")
      hasEnough =
        parseFloat(
          await this.cache.get(
            `${symbolObj.quote}:${indexes.indexKeys.WALLET}_${userId}`,
          ),
        ) >=
        price * qty;
    else
      hasEnough =
        parseFloat(
          await this.cache.get(
            `${symbolObj.base}:${indexes.indexKeys.WALLET}_${userId}`,
          ),
        ) >= qty;

    if (!hasEnough)
      throw new Error(
        `Você quer ${order.side} ${order.quantity} ${order.symbol} mas você não tem ativos suficientes.`,
      );

    return hasEnough;
  }

  async calcQty(orderTemplate, price, symbolObj, automationId) {
    price = parseFloat(price);
    const isBuyOrder = orderTemplate.side === ordersRepository.orderSide.BUY;
    const asset = parseFloat(
      await this.cache.get(
        `${isBuyOrder ? symbolObj.quote : symbolObj.base}:${indexes.indexKeys.WALLET}_${orderTemplate.userId}`,
      ),
    );
    if (!asset)
      throw new Error(
        `Não há ${isBuyOrder ? symbolObj.quote : symbolObj.base} na sua carteira para colocar um ${orderTemplate.side}`,
      );

    const quantity = orderTemplate.quantity.replace(",", ".");
    const multiplier = parseFloat(orderTemplate.quantityMultiplier || 1);
    if (parseFloat(quantity)) return quantity;

    let newQty;
    const minNotional = parseFloat(symbolObj.minNotional);
    const minQty = minNotional / price;

    if (quantity === "MAX_WALLET") {
      newQty = isBuyOrder
        ? (asset * (multiplier > 1 ? 1 : multiplier)) / price
        : asset * (multiplier > 1 ? 1 : multiplier);

      if (newQty < minQty) newQty = minQty;
    } else if (quantity === "MIN_NOTIONAL") {
      newQty = minQty * (multiplier < 1 ? 1 : multiplier);
    } else if (/^(AUTO|LAST)_ORDER_QTY$/.test(quantity)) {
      const orderIndex =
        quantity === "LAST_ORDER_QTY"
          ? `${indexes.indexKeys.LAST_ORDER}_${orderTemplate.userId}`
          : `${indexes.indexKeys.AUTO_ORDER}_${automationId}`;
      const lastOrder = await this.cache.get(
        `${orderTemplate.symbol}:${orderIndex}`,
      );
      if (!lastOrder)
        throw new Error(
          `Não existe um último pedido a ser usado como referência para ${orderTemplate.symbol}`,
        );

      newQty = parseFloat(lastOrder.quantity) * multiplier;
      if (!isBuyOrder && newQty > asset) newQty = asset;
      if (newQty < minQty) newQty = minQty;
    } else
      throw new Error(`Quantidade inválida no modelo de pedido: ${quantity}`);

    const stepSize = parseFloat(symbolObj.stepSize);
    const factor = Math.floor(newQty / stepSize);
    const finalQty = (factor * stepSize).toFixed(symbolObj.basePrecision);

    if (!isFinite(finalQty) || !finalQty)
      throw new Error(
        `Error in calcQty: OT: ${orderTemplate.id}, $: ${price}, qty: ${finalQty}`,
      );

    return finalQty;
  }

  async placeOrder(user, automation, orderTemplate) {
    if (!user || !automation || !orderTemplate)
      throw new Error(
        `Todos os parâmetros são obrigatórios. Usuário: ${!!user}, Automação: ${!!automation}, OT: ${!!orderTemplate}`,
      );

    const symbol = await symbolsRepository.getSymbol(orderTemplate.symbol);

    const order = {
      symbol: orderTemplate.symbol.toUpperCase(),
      side: orderTemplate.side.toUpperCase(),
      options: {
        type: orderTemplate.type.toUpperCase(),
      },
    };

    if (this.isValidQuoteOrder(orderTemplate)) {
      order.options.quoteOrderQty = await this.calcQuoteQty(
        orderTemplate,
        symbol,
      );
    } else {
      let price = await this.calcPrice(
        orderTemplate,
        symbol,
        false,
        automation.id,
      );

      if (ordersRepository.LIMIT_TYPES.includes(order.options.type))
        order.limitPrice = price;

      order.quantity = await this.calcQty(
        orderTemplate,
        price,
        symbol,
        automation.id,
      );

      if (ordersRepository.STOP_TYPES.includes(order.options.type)) {
        order.options.stopPrice = await this.calcPrice(
          orderTemplate,
          symbol,
          true,
          automation.id,
        );
        order.options.trailingDelta = orderTemplate.trailingDelta || undefined;
      }

      await this.hasEnoughAssets(user.id, symbol, order, price);
    }

    let result;
    const exchange = new Exchange(user.id);

    try {
      if (order.side === "BUY")
        result = await exchange.buy(
          order.symbol,
          order.quantity,
          order.limitPrice,
          order.options,
        );
      else
        result = await exchange.sell(
          order.symbol,
          order.quantity,
          order.limitPrice,
          order.options,
        );

      if (result.code !== undefined && result.code < 0)
        throw new Error(result.msg);
    } catch (err) {
      logger("A-" + automation.id, err.body ? err.body : err);
      logger("A-" + automation.id, order);
      return {
        type: "error",
        text: `Falha na Ordem ! ${err.body ? err.body : err.message}`,
      };
    }

    const savedOrder = await this.saveOrder(order, automation, result);
    return {
      type: "success",
      text: `Ordem ${order.side} ${order.symbol} ${savedOrder.status}`,
    };
  }

  async saveOrder(order, automation, result) {
    const savedOrder = await ordersRepository.insertOrder({
      automationId: automation.id,
      symbol: order.symbol,
      userId: automation.userId,
      quantity: order.quantity || result.executedQty,
      type: order.options.type,
      side: order.side,
      limitPrice: ordersRepository.LIMIT_TYPES.includes(order.options.type)
        ? order.limitPrice
        : null,
      stopPrice: ordersRepository.STOP_TYPES.includes(order.options.type)
        ? order.options.stopPrice
        : null,
      trailingDelta: ordersRepository.STOP_TYPES.includes(order.options.type)
        ? order.options.trailingDelta
        : null,
      orderId: result.orderId,
      transactTime: result.transactTime || result.updateTime,
      status: result.status || ordersRepository.orderStatus.NEW,
    });

    if (automation.logs)
      logger("A-" + automation.id, savedOrder.get({ plain: true }));
    return savedOrder;
  }

  async gridEval(automation) {
    automation.grids = automation.grids.sort((a, b) => a.id - b.id);

    if (automation.logs)
      logger(
        "A-" + automation.id,
        `RiberBot está na zona da grid em ${automation.name}`,
      );

    const tickerIndex = `${automation.symbol}:TICKER`;
    const MEMORY = await this.cache.getAll(tickerIndex);

    for (let i = 0; i < automation.grids.length; i++) {
      const grid = automation.grids[i];
      if (!Function("MEMORY", "return " + grid.condition)(MEMORY)) continue;

      if (automation.logs)
        logger(
          "A-" + automation.id,
          `RiberBot avaliou uma condição em ${automation.name} => ${grid.condition}`,
        );

      const user = await usersRepository.getUser(automation.userId);
      const orderTemplate =
        grid.side === ordersRepository.orderSide.BUY
          ? automation.openTemplate
          : automation.closeTemplate;
      const result = await this.placeOrder(user, automation, orderTemplate);

      if (result && automation.sendNotification)
        await this.sendNotifications(user, automation, result);

      if (!result || result.type === "error") return result || false;

      const transaction = await db.transaction();

      try {
        await this.generateGrids(
          automation,
          automation.grids.length + 1,
          orderTemplate.quantityMultiplier,
          transaction,
        );
        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        logger("A-" + automation.id, err);
        return {
          type: "error",
          text: `RiberBot não é possível gerar grids para ${automation.name}. ${err.message}`,
        };
      }

      automation = await automationsRepository.getAutomation(automation.id);
      this.BRAIN[automation.id] = automation.get({ plain: true });
      this.updateBrainIndex(tickerIndex, automation);

      return result || true;
    }

    return false;
  }

  async evalDecision(memoryKey, automation) {
    if (!automation || !memoryKey) return false;

    try {
      const isValid = await this.checkActivation(automation, memoryKey);
      if (!isValid) return false;

      if (this.isLocked(automation.id)) return false;
      this.setLocked(automation.id, true);

      if (automation.type === "GRID") return this.gridEval(automation);

      if (LOGS || automation.logs)
        logger(
          "A-" + automation.id,
          `RiberBot avaliou uma condição em '${automation.name}'`,
        );

      let result = {};
      const user = await usersRepository.getUser(automation.userId);

      if (
        (automation.isOpened && automation.closeTemplateId) ||
        (!automation.isOpened && automation.openTemplateId)
      ) {
        result = await this.placeOrder(
          user,
          automation,
          automation.isOpened
            ? automation.closeTemplate
            : automation.openTemplate,
        );
        if (result && result.type === "success" && automation.closeCondition) {
          const indexesToRemove = !automation.isOpened
            ? automation.openIndexes
            : automation.closeIndexes;
          this.deleteBrainIndex(indexesToRemove.split(","), automation.id);

          const indexesToAdd = !automation.isOpened
            ? automation.closeIndexes
            : automation.openIndexes;
          this.updateBrainIndex(indexesToAdd.split(","), automation);

          automation.isOpened = automation.isOpened ? false : true;
          await automationsRepository.updateAutomation(
            automation.id,
            automation,
          );
        }
      }

      const notificationResult = await this.sendNotifications(
        user,
        automation,
        result,
      );
      if (!result.text) result = notificationResult;

      if (automation.logs && result)
        logger(
          "A-" + automation.id,
          `Resultado para '${automation.name}' was ${JSON.stringify(
            result,
          )} at ${new Date()}`,
        );

      result.automationId = automation.id;

      return result || false;
    } catch (err) {
      if (automation.logs) logger("A-" + automation.id, err);
      return {
        type: "error",
        text: `Erro em evalDecision para '${automation.name}': ${err.message}`,
        automationId: automation.id,
      };
    } finally {
      setTimeout(() => {
        this.setLocked(automation.id, false);
      }, INTERVAL);
    }
  }

  async sendNotifications(user, automation, result) {
    if (!automation.sendNotification) return result;

    if (user.telegramChat && process.env.TELEGRAM_TOKEN) {
      const telegramResult = await this.sendTelegram(
        user.telegramChat,
        automation,
        result.text + "\n" + automation.name,
      );
      if (!result.text) result = telegramResult;
    }

    if (user.email && process.env.SMTP_SERVER) {
      const emailResult = await this.sendEmail(
        user.email,
        automation,
        result.text + "\n" + automation.name,
      );
      if (!result.text) result = emailResult;
    }

    return result;
  }

  async sendTelegram(telegramChat, automation, message) {
    const defaultMessage = automation.name + " disparou!";
    await telegram(telegramChat, message ? message : defaultMessage);
    if (automation.logs)
      logger(
        "A-" + automation.id,
        `Telegram enviado pela automação '${automation.name}'!`,
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
        `E-mail enviado pela automação '${automation.name}'!`,
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
      (ix) => MEMORY[ix] !== null && MEMORY[ix] !== undefined,
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

    if (LOGS || automation.logs) {
      logger(
        "A-" + automation.id,
        `RiberBot tentando analizar:\n${evalCondition} at ${automation.name}`,
      );
      logger("A-" + automation.id, MEMORY);
    }

    return evalCondition
      ? Function("MEMORY", "return " + evalCondition)(MEMORY)
      : true;
  }

  invertCondition(memoryKey, condition) {
    const conds = condition.split(" && ");
    const condToInvert = conds.find(
      (c) => c.indexOf(memoryKey) !== -1 && c.indexOf("current") !== -1,
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
      automation.type === "GRID" ||
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

  async updateTickerMemory(
    symbol,
    index,
    originalTicker,
    executeAutomations = true,
  ) {
    const ticker = { ...originalTicker };
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
    executeAutomations = true,
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

  updateOrderMemory(index, originalOrder, executeAutomations) {
    let order = { ...originalOrder };

    if (originalOrder.toJSON) order = originalOrder.toJSON();
    if (originalOrder.get) order = originalOrder.get({ plain: true });

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
    executeAutomations = true,
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
          calculatedIndexes,
        )} => execute? ${executeAutomations}`,
      );

    return results;
  }

  deleteMemory(symbol, index, interval) {
    const memoryKey = this.buildMemoryKey(symbol, index, interval);
    return this.cache.unset(memoryKey);
  }

  flattenObject(obj) {
    let toReturn = {};

    for (let prop in obj) {
      if (!obj.hasOwnProperty(prop)) continue;

      if (typeof obj[prop] == "object" && obj[prop] !== null) {
        let flatObject = this.flattenObject(obj[prop]);
        for (let innerProp in flatObject) {
          if (!flatObject.hasOwnProperty(innerProp)) continue;
          toReturn[prop + "." + innerProp] = flatObject[innerProp];
        }
      } else toReturn[prop] = obj[prop];
    }

    return toReturn;
  }

  getEval(prop) {
    if (prop.indexOf("MEMORY") !== -1) return prop;
    if (prop.indexOf(".") === -1) return `MEMORY['${prop}']`;

    const propSplit = prop.split(".");
    const memKey = propSplit[0];
    const memProp = prop.replace(memKey, "");
    return `MEMORY['${memKey}']${memProp}`;
  }

  async getMemoryIndexes() {
    const MEMORY = await this.getMemory();
    return Object.entries(this.flattenObject(MEMORY))
      .map((prop) => {
        if (prop[0].indexOf("previous") !== -1 || prop[0].indexOf(":") === -1)
          return false;
        const propSplit = prop[0].split(":");
        return {
          symbol: propSplit[0],
          variable: propSplit[1].replace(".current", ""),
          eval: this.getEval(prop[0]),
          example: prop[1],
        };
      })
      .filter((ix) => ix)
      .sort((a, b) => {
        return a.variable < b.variable ? -1 : 1;
      });
  }

  async generateGrids(automation, levels, quantity, transaction) {
    if (!automation.openTemplate || !automation.closeTemplate)
      throw new Error(
        `Não há modelos de pedido para esta automação de GRID: ${automation.id}`,
      );

    if (
      automation.openTemplate &&
      automation.openTemplate.quantityMultiplier !== quantity
    ) {
      automation.openTemplate.quantityMultiplier = quantity;
      await orderTemplatesRepository.updateOrderTemplate(
        automation.userId,
        automation.openTemplateId,
        automation.openTemplate,
        transaction,
      );
    }

    if (
      automation.closeTemplate &&
      automation.closeTemplate.quantityMultiplier !== quantity
    ) {
      automation.closeTemplate.quantityMultiplier = quantity;
      await orderTemplatesRepository.updateOrderTemplate(
        automation.userId,
        automation.closeTemplateId,
        automation.closeTemplate,
        transaction,
      );
    }

    await gridsRepository.deleteGrids(automation.id, transaction);

    levels = parseInt(levels);
    const conditionSplit = automation.openCondition.split(" && ");
    const lowerLimit = parseFloat(conditionSplit[0].split(">")[1]);
    const upperLimit = parseFloat(conditionSplit[1].split("<")[1]);
    const priceByLevel = (upperLimit - lowerLimit) / levels;
    const grids = [];
    const differences = [];

    const tickerIndex = `${automation.symbol}:${indexes.indexKeys.TICKER}`;
    const ticker = await this.cache.get(tickerIndex);
    if (!ticker) throw new Error(`There is no ticker for ${automation.symbol}`);
    const currentPrice = parseFloat(ticker.current.close);

    for (let i = 1; i <= levels; i++) {
      const targetPrice = lowerLimit + priceByLevel * i;
      differences.push(Math.abs(currentPrice - targetPrice));

      if (targetPrice < currentPrice) {
        //se está abaixo da cotação, compra
        const prevLevelPrice = targetPrice - priceByLevel;
        grids.push({
          automationId: automation.id,
          side: ordersRepository.orderSide.BUY,
          condition: `MEMORY['${tickerIndex}'].current.close<${targetPrice} && MEMORY['${tickerIndex}'].previous.close>=${targetPrice} && MEMORY['${tickerIndex}'].current.close>${prevLevelPrice}`,
        });
      } else {
        //se está acima da cotação, venda
        const nextLevelPrice = targetPrice + priceByLevel;
        grids.push({
          automationId: automation.id,
          side: ordersRepository.orderSide.SELL,
          condition: `MEMORY['${tickerIndex}'].current.close>${targetPrice} && MEMORY['${tickerIndex}'].previous.close<=${targetPrice} && MEMORY['${tickerIndex}'].current.close<${nextLevelPrice}`,
        });
      }
    }

    const nearestGrid = differences.findIndex(
      (d) => d === Math.min(...differences),
    );
    grids.splice(nearestGrid, 1);

    return gridsRepository.insertGrids(grids, transaction);
  }
}
