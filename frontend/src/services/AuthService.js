import axios from "./BaseService";

const API_URL = import.meta.env.VITE_API_URL;

export async function doLogin(email, password) {
    const loginUrl = API_URL + "/login";
    const response = await axios.post(loginUrl, { email, password });
    return response.data;
}

export async function doLogout() {
    const loginUrl = API_URL + "/logout";
    const response = await axios.post(loginUrl, {});
    return response.data;
}
