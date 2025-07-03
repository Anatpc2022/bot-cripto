import axios from "./BaseService";

const API_URL = import.meta.env.VITE_API_URL;

export const ORDER_TYPES = {
  MARKET: "MARKET",
  LIMIT: "LIMIT",
  STOP_LOSS: "STOP_LOSS",
  STOP_LOSS_LIMIT: "STOP_LOSS_LIMIT",
  TAKE_PROFIT: "TAKE_PROFIT",
  TAKE_PROFIT_LIMIT: "TAKE_PROFIT_LIMIT",
};

export const STOP_TYPES = [
  ORDER_TYPES.STOP_LOSS,
  ORDER_TYPES.STOP_LOSS_LIMIT,
  ORDER_TYPES.TAKE_PROFIT,
  ORDER_TYPES.TAKE_PROFIT_LIMIT,
];

export const MARKET_TYPES = [
  ORDER_TYPES.MARKET,
  ORDER_TYPES.STOP_LOSS,
  ORDER_TYPES.TAKE_PROFIT,
];

export const LIMIT_TYPES = [
  ORDER_TYPES.LIMIT,
  ORDER_TYPES.STOP_LOSS_LIMIT,
  ORDER_TYPES.TAKE_PROFIT_LIMIT,
];

export async function getBalance() {
  const url = API_URL + "/exchange/balance";
  const response = await axios.get(url);
  return response.data;
}
