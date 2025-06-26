import axios from "./BaseService";

const SYMBOLS_URL = import.meta.env.VITE_API_URL + "/symbols";

export async function getSymbols() {
    const response = await axios.get(SYMBOLS_URL);
    return response.data;
}

export async function getSymbol(symbol) {
    const response = await axios.get(`${SYMBOLS_URL}/${symbol}`);
    return response.data;
}