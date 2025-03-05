import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken, removeToken } from "../utils/tokenService";
import {jwtDecode} from "jwt-decode";

// Определяем тип данных пользователя с поддержкой ролей
interface User {
    email: string;
    roles: string[];
    exp: number;
}

// Определяем тип контекста, добавив метод hasRole
interface AuthContextType {
    user: User | null;
    login: (access_token: string) => void;
    logout: () => void;
    hasRole: (role: string) => boolean;
}

// Создаем контекст с начальным значением null
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const access_token = getToken();
        if (access_token) {
            try {
                const decoded: User = jwtDecode(access_token);
                decoded.roles = ["admin"];
                // Проверка срока действия токена
                if (decoded.exp * 1000 < Date.now()) {
                    removeToken();
                    setUser(null);
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
                removeToken(); // Удаляем битый токен
            }
        }
    }, []);

    const login = (access_token: string) => {
        setToken(access_token);
        try {
            const decoded: User = jwtDecode(access_token);
            setUser(decoded);
        } catch (error) {
            console.error("Ошибка при декодировании токена:", error);
        }
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    // Метод для проверки наличия определенной роли
    const hasRole = (role: string): boolean => {
        return user ? user.roles.includes(role) : false;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};