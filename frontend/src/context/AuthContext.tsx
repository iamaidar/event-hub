import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken, removeToken } from "../utils/tokenService";
import {jwtDecode} from "jwt-decode";

// Определяем тип данных пользователя с поддержкой ролей
interface User {
    email: string;
    roles: string[]; // добавлено свойство ролей
    exp: number;
}

// Определяем тип контекста
interface AuthContextType {
    user: User | null;
    login: (access_token: string) => void;
    logout: () => void;
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
        const decoded: User = jwtDecode(access_token);
        setUser(decoded);
    };

    const logout = () => {
        removeToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};