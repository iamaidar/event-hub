import api from "./axiosInstance";

interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

interface AuthResponse {
    data: AuthTokens;
    statusCode: number;
    message: string;
}

export const login = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const response = await api.post("/auth/signin", { email, password });
    return response.data;
};

export const register = async (
    email: string,
    password: string,
    username: string
): Promise<AuthResponse> => {
    const response = await api.post("/auth/signup", { email, password, username });
    return response.data;
};

export const refreshTokenRequest = async (
    refresh_token: string
): Promise<AuthResponse> => {
    const response = await api.post("/auth/refresh", { refresh_token });
    return response.data;
};