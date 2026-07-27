import orderModel from "../models/orderModel.js";
import Sequelize, { Op } from "sequelize";
import AutomationModel from "../models/automationModel.js";

export const orderTypes = {
  MARKET: "MARKET",
  LIMIT: "LIMIT",
  STOP_LOSS: "STOP_LOSS",
  STOP_LOSS_LIMIT: "STOP_LOSS_LIMIT",
  TAKE_PROFIT: "TAKE_PROFIT",
  TAKE_PROFIT_LIMIT: "TAKE_PROFIT_LIMIT",
};

const orderSide = {
  BUY: "BUY",
  SELL: "SELL",
};

const orderStatus = {
  FILLED: "FILLED",
  PARTIALLY_FILLED: "PARTIALLY_FILLED",
  CANCELED: "CANCELED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
  NEW: "NEW",
};

const STOP_TYPES = [
  orderTypes.STOP_LOSS,
  orderTypes.STOP_LOSS_LIMIT,
  orderTypes.TAKE_PROFIT,
  orderTypes.TAKE_PROFIT_LIMIT,
];

const LIMIT_TYPES = [
  orderTypes.LIMIT,
  orderTypes.TAKE_PROFIT_LIMIT,
  orderTypes.STOP_LOSS_LIMIT,
];

const MARKET_TYPES = [
  orderTypes.MARKET,
  orderTypes.STOP_LOSS,
  orderTypes.TAKE_PROFIT,
];

function insertOrder(newOrder) {
  return orderModel.create(newOrder);
}

function getOrders(userId, page = 1) {
  const options = {
    where: { userId },
    order: [["id", "DESC"]],
    limit: 10,
    offset: 10 * (page - 1),
    distinct: true,
  };

  return orderModel.findAndCountAll(options); //{ rows: [], count: x }
}

function getOrderById(id, userId) {
  return orderModel.findOne({
    where: { id, userId },
    include: AutomationModel,
  });
}

function getOrder(orderId) {
  return orderModel.findOne({ where: { orderId }, include: AutomationModel });
}

async function updateOrder(currentOrder, newOrder) {
  if (!currentOrder || !newOrder) return false;

  if (
    newOrder.status &&
    newOrder.status !== currentOrder.status &&
    [orderStatus.NEW, orderStatus.PARTIALLY_FILLED].includes(
      currentOrder.status,
    )
  )
    currentOrder.status = newOrder.status;

  if (newOrder.avgPrice && newOrder.avgPrice !== currentOrder.avgPrice)
    currentOrder.avgPrice = newOrder.avgPrice;

  if (newOrder.obs !== currentOrder.obs) currentOrder.obs = newOrder.obs;

  if (
    newOrder.transactTime &&
    newOrder.transactTime !== currentOrder.transactTime
  )
    currentOrder.transactTime = newOrder.transactTime;

  if (
    newOrder.commission !== null &&
    newOrder.commission !== undefined &&
    newOrder.commission !== currentOrder.commission
  )
    currentOrder.commission = newOrder.commission;

  if (
    newOrder.net !== null &&
    newOrder.net !== undefined &&
    newOrder.net !== currentOrder.net
  )
    currentOrder.net = newOrder.net;

  if (newOrder.quantity && newOrder.quantity !== currentOrder.quantity)
    currentOrder.quantity = newOrder.quantity;

  await currentOrder.save();
  return currentOrder;
}

async function updateOrderById(id, newOrder) {
  const order = await getOrderById(id, newOrder.userId);
  if (!order) return false;
  return updateOrder(order, newOrder);
}

async function updateOrderByOrderId(orderId, newOrder) {
  const order = await getOrder(orderId);
  if (!order) return false;
  return updateOrder(order, newOrder);
}

async function getLastFilledOrders(userId) {
  const where = {
    userId,
    status: orderStatus.FILLED,
  };

  const idObjects = await orderModel.findAll({
    where,
    group: "symbol",
    attributes: [Sequelize.fn("max", Sequelize.col("id"))],
    raw: true,
  });

  const ids = idObjects.map((o) => Object.values(o)).flat();
  return orderModel.findAll({ where: { id: ids } });
}

async function getLastAutomationOrders() {
  const where = {
    automationId: { [Op.ne]: null },
    status: orderStatus.FILLED,
  };

  const idObjects = await orderModel.findAll({
    where,
    group: "automationId",
    attributes: [Sequelize.fn("max", Sequelize.col("id"))],
    raw: true,
  });

  const ids = idObjects.map((o) => Object.values(o)).flat();
  return orderModel.findAll({ where: { id: ids } });
}

async function removeAutomationFromOrders(automationId, transaction) {
  return orderModel.update(
    {
      automationId: null,
    },
    {
      where: { automationId },
      transaction,
    },
  );
}

async function getReportOrders(userId, quoteAsset, startDate, endDate) {
  startDate = startDate || 0;
  endDate = endDate || Date.now();

  const where = {
    userId,
    symbol: { [Sequelize.Op.like]: `%${quoteAsset}` },
    transactTime: { [Sequelize.Op.between]: [startDate, endDate] },
    status: orderStatus.FILLED,
    net: { [Sequelize.Op.gt]: 0 },
  };

  return orderModel.findAll({
    where,
    order: [["transactTime", "ASC"]],
    include: AutomationModel,
    raw: true,
    distinct: true,
  });
}

export default {
  orderStatus,
  STOP_TYPES,
  LIMIT_TYPES,
  MARKET_TYPES,
  orderSide,
  orderTypes,
  insertOrder,
  getOrders,
  getOrderById,
  getOrder,
  updateOrderById,
  updateOrderByOrderId,
  getLastFilledOrders,
  removeAutomationFromOrders,
  getLastAutomationOrders,
  getReportOrders,
};
