import orderModel from "../models/orderModel.js";
import Sequelize from "sequelize";

const orderTypes = {
    MARKET: "MARKET",
    LIMIT: "LIMIT",
    STOP_LOSS: "STOP_LOSS",
    STOP_LOSS_LIMIT: "STOP_LOSS_LIMIT",
    TAKE_PROFIT: "TAKE_PROFIT",
    TAKE_PROFIT_LIMIT: "TAKE_PROFIT_LIMIT"
}

const orderSide = {
    BUY: "BUY",
    SELL: "SELL"
}

const orderStatus = {
    FILLED: "FILLED",
    PARTIALLY_FILLED: "PARTIALLY_FILLED",
    CANCELED: "CANCELED",
    REJECTED: "REJECTED",
    EXPIRED: "EXPIRED",
    NEW: "NEW"
}

const STOP_TYPES = [orderTypes.STOP_LOSS, orderTypes.STOP_LOSS_LIMIT, orderTypes.TAKE_PROFIT, orderTypes.TAKE_PROFIT_LIMIT];

const LIMIT_TYPES = [orderTypes.LIMIT, orderTypes.TAKE_PROFIT_LIMIT, orderTypes.STOP_LOSS_LIMIT];

const MARKET_TYPES = [orderTypes.MARKET, orderTypes.STOP_LOSS, orderTypes.TAKE_PROFIT];

export default {
    orderStatus,
    STOP_TYPES,
    LIMIT_TYPES,
    MARKET_TYPES,
    orderSide,
    orderTypes,
}