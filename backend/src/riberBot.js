import Cache from "./utils/cache.js";
import logger from "./utils/logger.js";
import indexes from "./utils/indexes.js";

const LOGS = process.env.RIBERBOT_LOGS === "true";

export default class RiberBot {
  static instance;

  static getInstance(automations = []) {
    if (!RiberBot.instance) RiberBot.instance = new RiberBot(automations);
    return RiberBot.instance;
  }

  constructor(automations) {
    this.cache = new Cache();

    this.BRAIN = {};
    //inicializar o brain com as automationsAdd commentMore actions
  }

  getBrain() {
    return { ...this.BRAIN };
  }

  static FIAT_COINS = ["BRL", "EUR", "GBP"];

  static DOLLAR_COINS = ["USD", "USDT", "USDC", "TUSD", "FDUSD", "UST"];

  async getStableConversion(baseAsset, quoteAsset, baseQty) {
    if (RiberBot.DOLLAR_COINS.includes(baseAsset)) return baseQty;

    const ticker = await this.getMemory(baseAsset + quoteAsset, indexes.indexKeys.TICKER);
    if (ticker && ticker.current)
      return parseFloat(baseQty) * ticker.current.close;
    return 0;
  }

  async getFiatConversion(stablecoin, fiatCoin, fiatQty) {
    const ticker = await this.getMemory(stablecoin + fiatCoin, indexes.indexKeys.TICKER);
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
        "riberBot",
        `RiberBot memória atualizada: ${memoryKey} => ${JSON.stringify(value)}`
      );

    this.cache.set(memoryKey, value);

    //testa as automações
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

    this.setCache(symbol, index, null, newMemory, executeAutomations);
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

    if (index === indexes.indexKeys.TICKER)
      return this.updateTickerMemory(symbol, index, value, executeAutomations);
    else
      return this.setCache(symbol, index, interval, value, executeAutomations);
  }
}
