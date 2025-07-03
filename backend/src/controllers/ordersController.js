import ordersRepository from "../repositories/ordersRepository.js";
import Exchange from "../utils/exchange.js";
import logger from "../utils/logger.js";

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

export default {
  getOrder,
  getOrders,
  placeOrder,
};
