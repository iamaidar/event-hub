import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    removeTokens
} from "../utils/tokenService";
import { refreshTokenRequest } from "./authApi";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const setupAxiosInterceptors = (authContext?: {
    logout: () => void;
}) => {
    api.interceptors.request.use(
        (config) => {
            const token = getAccessToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry
            ) {
                console.log(error);
                originalRequest._retry = true;
                const refresh_token = getRefreshToken();
                if (refresh_token) {
                    try {
                        const { data } = await refreshTokenRequest(refresh_token);
                        if (data && data.access_token) {
                            setAccessToken(data.access_token);
                            setRefreshToken(data.refresh_token);
                            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                            return api(originalRequest);
                        }
                    } catch (refreshError) {
                        if (authContext && authContext.logout) {
                            authContext.logout();
                        }
                        removeTokens();
                        return Promise.reject(refreshError);
                    }
                } else {
                    if (authContext && authContext.logout) {
                        authContext.logout();
                    }
                    removeTokens();
                }
            }
            return Promise.reject(error);
        }
    );
};

export default api;