import axios from "./BaseService";

const API_URL = import.meta.env.VITE_API_URL;

export async function getBalance() {
    const url = API_URL + "/exchange/balance";
    const response = await axios.get(url);
    return response.data;
}