import { createContext, useState, useEffect, ReactNode } from "react";
import { getToken, setToken, removeToken } from "../utils/tokenService";
import {jwtDecode} from "jwt-decode";

// Определяем тип данных пользователя
interface User {
    email: string;
    exp: number;
}

// Определяем тип контекста
interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

// Создаем контекст с начальным значением null
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const decoded: User = jwtDecode(token);

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

    const login = (token: string) => {
        setToken(token);
        const decoded: User = jwtDecode(token);
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