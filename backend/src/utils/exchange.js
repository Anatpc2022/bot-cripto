import Binance from "node-binance-api";
import logger from "./logger.js";
import { orderTypes } from "../repositories/ordersRepository.js";

const LOGS = process.env.BINANCE_LOGS === "true";
const APIKEY = process.env.ACCESS_KEY;
const APISECRET = process.env.SECRET_KEY;

export default class Exchange {
  constructor(userId) {
    if (!APIKEY || !APISECRET)
      throw new Error("Chaves Binance não encontradas!");

    this.userId = userId;
    this.binance = new Binance().options({
      APIKEY,
      APISECRET,
      family: 0,
      test: process.env.NODE_ENV !== "production",
      verbose: LOGS,
    });
  }

  exchangeInfo() {
    return this.binance.exchangeInfo();
  }

  async balance() {
    await this.binance.useServerTime();
    return this.binance.balance();
  }

  cancel(symbol, orderId) {
    return this.binance.cancel(symbol, orderId);
  }

  orderStatus(symbol, orderId) {
    return this.binance.orderStatus(symbol, orderId);
  }

  async orderTrade(symbol, orderId) {
    const trades = await this.binance.trades(symbol, { orderId });
    const quoteTrades = trades.filter((t) =>
      symbol.endsWith(t.commissionAsset),
    );
    if (!quoteTrades || !quoteTrades.length) return false;

    const aggTrade = {
      commission: quoteTrades
        .map((t) => parseFloat(t.commission))
        .reduce((a, b) => a + b),
      commissionAsset: quoteTrades[0].commissionAsset,
    };
    return aggTrade;
  }

  tickerStream(callback) {
    this.binance.websockets.miniTicker((data) => {
      const converted = Object.keys(data).map((key) => {
        return {
          symbol: key,
          ...data[key],
        };
      });
      callback(converted);
    }, true);
  }

  userDataStream(balanceCallback, executionCallback) {
    this.binance.websockets.userData(
      () => {},
      balanceCallback,
      executionCallback,
      (data) => {
        logger(
          `U-${this.userId}`,
          "userDataStream:subscribed:" + JSON.stringify(data),
        );
        this.binance.options.listenKey = data;
      },
      () => {},
    );
  }

  chartStream(symbol, interval, callback) {
    const streamUrl = this.binance.websockets.chart(
      symbol,
      interval,
      (symbol, interval, chart) => {
        const ohlc = this.binance.populateOHLC(chart);
        callback(ohlc);
      },
    );
    if (LOGS)
      logger(`U-${this.userId}`, `Chart Stream connected at ${streamUrl}`);
  }

  terminateChartStream(symbol, interval) {
    const streamUrl = `${this.binance.getStreamUrl()}${symbol.toLowerCase()}@kline_${interval}`;
    this.binance.websockets.terminate(streamUrl);
    if (LOGS)
      logger(
        `U-${this.userId}`,
        `Chart Stream terminated at ${symbol.toLowerCase()}@kline_${interval}`,
      );
  }

  buy(symbol, quantity, price, options) {
    if (!options || options.type === orderTypes.MARKET)
      return this.binance.marketBuy(symbol, quantity, options);

    if (options.type === orderTypes.LIMIT)
      return this.binance.buy(symbol, quantity, price, options);

    return this.binance.order(
      options.type,
      "BUY",
      symbol,
      quantity,
      price,
      options,
    );
  }

  sell(symbol, quantity, price, options) {
    if (!options || options.type === orderTypes.MARKET)
      return this.binance.marketSell(symbol, quantity, options);

    if (options.type === orderTypes.LIMIT)
      return this.binance.sell(symbol, quantity, price, options);

    return this.binance.order(
      options.type,
      "SELL",
      symbol,
      quantity,
      price,
      options,
    );
  }
}
