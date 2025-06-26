import axios from "./BaseService";

const API_URL = import.meta.env.VITE_API_URL;

export const STOP_TYPES = ["STOP_LOSS", "STOP_LOSS_LIMIT", "TAKE_PROFIT", "TAKE_PROFIT_LIMIT"];

export const MARKET_TYPES = ["MARKET", "STOP_LOSS", "TAKE_PROFIT"];

export const LIMIT_TYPES = ["LIMIT", "STOP_LOSS_LIMIT", "TAKE_PROFIT_LIMIT"];

export async function getBalance() {
    const url = API_URL + "/exchange/balance";
    const response = await axios.get(url);
    return response.data;
}