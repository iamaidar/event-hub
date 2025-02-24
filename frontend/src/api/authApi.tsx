import { getToken, removeToken } from "../utils/tokenService";
import api from "./axiosInstance.tsx";

interface AuthResponse {
    access_token: string;
}

// export const login = async (): Promise<AuthResponse> => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
//                 JSON.stringify({ email: "test@example.com", exp: Math.floor(Date.now() / 1000) + 3600 })
//             )}.signature`;
//             setToken(fakeToken);
//             resolve({ token: fakeToken });
//         }, 1000);
//     });
// };
export const login = async (email: string, password: string): Promise<AuthResponse>  => {
    const response = await api.post("auth/signin", { email, password });
    return response.data;
};

export const register = async (email: string, password: string, username: string): Promise<AuthResponse>  => {
    const response = await api.post<AuthResponse>("auth/signup", { email, password,username });
    return response.data;
};
//
// export const getUserProfile = async () => {
//     const response = await api.get("/profile");
//     return response.data;
// };
export const getUserProfile = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const access_token = getToken();
            if (access_token) {
                const user = { email: atob(access_token.split(".")[2]) };
                resolve(user);
            } else {
                reject("No token found");
            }
        }, 500);
    });
};

export const logout = () => {
    removeToken();
};