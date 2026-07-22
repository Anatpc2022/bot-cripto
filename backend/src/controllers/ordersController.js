import ordersRepository from "../repositories/ordersRepository.js";
import Exchange from "../utils/exchange.js";
import logger from "../utils/logger.js";
import RiberBot from "../riberBot.js";

async function getOrder(req, res) {
  const userId = res.locals.token.id;
  const id = req.params.id;
  const order = await ordersRepository.getOrderById(id, userId);
  if (!order) return res.sendStatus(404);
  res.json(order);
}

async function getOrders(req, res) {
  const userId = res.locals.token.id;
  const page = parseInt(req.query.page || 1);
  const orders = await ordersRepository.getOrders(userId, page);
  res.json(orders); // { row: [], count: x }
}

async function cancelOrder(req, res) {
  const userId = res.locals.token.id;
  const { symbol, orderId } = req.params;

  const exchange = new Exchange(userId);

  try {
    const result = await exchange.cancel(symbol, orderId);
    const order = await ordersRepository.updateOrderByOrderId(result.orderId, {
      status: result.status,
    });
    res.json(order.get({ plain: true }));
  } catch (err) {
    logger("U-" + userId, err.body ? JSON.stringify(err.body) : err.message);
    return res.status(400).json(err.body ? err.body : err.message);
  }
}

async function syncOrder(req, res) {
  const userId = res.locals.token.id;
  const exchange = new Exchange(userId);

  const riberBotOrderId = req.params.id;
  let order = await ordersRepository.getOrderById(riberBotOrderId, userId);
  if (!order) return res.sendStatus(404);
  if (order.userId !== userId) return res.sendStatus(403);

  try {
    const binanceOrder = await exchange.orderStatus(
      order.symbol,
      order.orderId,
    );

    order.status = binanceOrder.status;
    order.transactTime = binanceOrder.updateTime;

    if (binanceOrder.status === ordersRepository.orderStatus.FILLED) {
      const binanceTrade = await exchange.orderTrade(
        order.symbol,
        order.orderId,
      );
      const quoteQuantity = parseFloat(binanceOrder.cummulativeQuoteQty);

      order.avgPrice = quoteQuantity / parseFloat(binanceOrder.executedQty);
      order.commission = binanceTrade.commission || 0;
      order.quantity = binanceOrder.executedQty;
      order.obs = "Comissão=" + (binanceTrade.commissionAsset || "");

      const isQuoteCommission =
        binanceTrade.commissionAsset &&
        order.symbol.endsWith(binanceTrade.commissionAsset);
      if (isQuoteCommission)
        order.net = quoteQuantity - parseFloat(order.commission);
      else order.net = quoteQuantity;
    }

    await order.save();
    res.json(order.get({ plain: true }));
  } catch (err) {
    logger("U-" + userId, err.body ? JSON.stringify(err.body) : err.message);
    return res.status(400).json(err.body ? err.body : err.message);
  }
}

async function placeOrder(req, res) {
  const userId = res.locals.token.id;
  const exchange = new Exchange(userId);
  const { side, symbol, quantity, limitPrice, options } = req.body;
  let result;

  try {
    if (side === ordersRepository.orderSide.BUY)
      result = await exchange.buy(symbol, quantity, limitPrice, options);
    else if (side === ordersRepository.orderSide.SELL)
      result = await exchange.sell(symbol, quantity, limitPrice, options);
    else return res.sendStatus(400);

    if (result.code !== undefined && result.code < 0)
      throw new Error(result.msg);

    const order = await ordersRepository.insertOrder({
      userId,
      symbol,
      quantity: options && options.quoteOrderQty ? "" : quantity,
      type: options ? options.type : ordersRepository.orderTypes.MARKET,
      side,
      limitPrice,
      stopPrice: options ? options.stopPrice : null,
      trailingDelta: options ? options.trailingDelta : null,
      orderId: result.orderId,
      transactTime: result.transactTime || result.updateTime,
      status: result.status || ordersRepository.orderStatus.NEW,
    });
    res.status(201).json(order.get({ plain: true }));
  } catch (err) {
    logger("U-" + userId, err.body ? JSON.stringify(err.body) : err.message);
    return res.status(400).json(err.body ? err.body : err.message);
  }
}

async function getOrdersReport(req, res, next) {
  if (req.query.date) return getDayTradeReport(req, res, next);
  else return getMonthReport(req, res, next);
}

async function getDayTradeReport(req, res) {}

function thirtyDaysAgo() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 30);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime();
}

function getToday() {
  const date = new Date();
  date.setUTCHours(23, 59, 59, 999);
  return date.getTime();
}

const EMPTY_REPORT = {
  orders: 0,
  buyVolume: 0,
  sellVolume: 0,
  wallet: 0,
  profit: 0,
  profitPerc: 0,
  subs: [],
  series: [],
  automations: [],
};

function calcVolume(orders, side, startTime, endTime) {
  startTime = startTime || 0;
  endTime = endTime || Date.now();

  const filteredOrders = orders.filter(
    (o) =>
      o.transactTime >= startTime &&
      o.transactTime < endTime &&
      o.side === side,
  );
  if (!filteredOrders || !filteredOrders.length) return 0;

  return filteredOrders.map((o) => parseFloat(o.net)).reduce((a, b) => a + b);
}

async function getMonthReport(req, res) {
  const userId = res.locals.token.id;
  const quote = req.params.quote;

  let startDate = req.query.startDate
    ? parseInt(req.query.startDate)
    : thirtyDaysAgo();
  let endDate = req.query.endDate ? parseInt(req.query.endDate) : getToday();

  if (endDate - startDate > 30 * 24 * 60 * 60 * 1000)
    startDate = thirtyDaysAgo();

  const orders = await ordersRepository.getReportOrders(
    userId,
    quote,
    startDate,
    endDate,
  );
  if (!orders || !orders.length)
    return res.json({ ...EMPTY_REPORT, quote, startDate, endDate });

  const daysInRage = Math.ceil((endDate - startDate) / (24 * 60 * 60 * 1000));

  const subs = [];
  const series = [];

  for (let i = 0; i < daysInRage; i++) {
    const newDate = new Date(startDate);
    newDate.setUTCDate(newDate.getUTCDate() + i);
    subs.push(`${newDate.getUTCDate()}/${newDate.getUTCMonth() + 1}`);

    const lastMoment = new Date(newDate.getTime());
    lastMoment.setUTCHours(23, 59, 59, 999);

    const partialBuy = calcVolume(
      orders,
      "BUY",
      newDate.getTime(),
      lastMoment.getTime(),
    );
    const partialSell = calcVolume(
      orders,
      "SELL",
      newDate.getTime(),
      lastMoment.getTime(),
    );
    series.push(partialSell - partialBuy);
  }

  const buyVolume = calcVolume(orders, "BUY");
  const sellVolume = calcVolume(orders, "SELL");
  const profit = sellVolume - buyVolume;

  const wallet = await RiberBot.getInstance().getMemory(
    quote,
    "WALLET_" + userId,
  );
  const profitPerc = (profit * 100) / (parseFloat(wallet) - profit);

  //agrupamento por automações

  res.json({
    quote,
    orders: orders.length,
    buyVolume,
    sellVolume,
    wallet,
    profit,
    profitPerc,
    startDate,
    endDate,
    subs,
    series,
    automations: [],
  });
}

export default {
  getOrder,
  getOrders,
  placeOrder,
  syncOrder,
  cancelOrder,
  getOrdersReport,
};
