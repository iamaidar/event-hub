import axios from "axios";
import { getToken } from "../utils/tokenService";

const api = axios.create({
    baseURL: "https://your-backend.com/api",
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;