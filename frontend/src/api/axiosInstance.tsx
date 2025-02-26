import axios from "axios";
import { getToken } from "../utils/tokenService";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000, // 10 секунд
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Если сервер использует куки для авторизации
});

// **Interceptor для установки токена**
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// **Interceptor для обработки ошибок**
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("Ошибка API:", error.response.data);

            // Обработка истекшего токена (если сервер возвращает 401)
            if (error.response.status === 401) {
                console.warn("Токен истёк или недействителен. Необходимо выйти из системы.");
                // Можно вызвать функцию для выхода пользователя
                // logoutUser();
            }
        } else if (error.request) {
            console.error("Сервер не отвечает", error.request);
        } else {
            console.error("Ошибка запроса:", error.message);
        }

        return Promise.reject(error);
    }
);

export default api;