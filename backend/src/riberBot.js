import Cache from "./utils/cache.js";
import logger from "./utils/logger.js";

const LOGS = process.env.RIBERBOT_LOGS === "true";

export default class RiberBot {
  static instance;

  static getInstance(automations = []) {
    if (!RiberBot.instance) RiberBot.instance = new RiberBot(automations);
    return RiberBot.instance;
  }

  constructor(automations) {
    this.cache = new Cache();

    //inicializar o cérebro
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

    if (index === "TICKER")
      return this.updateTickerMemory(symbol, index, value, executeAutomations);
    else
      return this.setCache(symbol, index, interval, value, executeAutomations);
  }
}
