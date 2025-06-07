import axios from "axios";

axios.interceptors.request.use(
    config => {
        config.headers.Authorization = localStorage.getItem("token");
        return config;
    },
    error => Promise.reject(error)
)

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status == 401) {
            console.error("Redirecionado para login pela resposta 401!");
             if (window.location.pathname !== "/")
                window.location.href = "/";
            else
                return Promise.reject(error.response ? error.response.data : error);
        }
        else
            return Promise.reject(error.response ? error.response.data : error);
    }
)

export default axios;