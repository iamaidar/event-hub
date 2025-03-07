import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { getAccessToken, setAccessToken, setRefreshToken, removeTokens, getRefreshToken } from "../utils/tokenService";
import { refreshTokenRequest } from "../api/authApi";
import {jwtDecode} from "jwt-decode";

interface User {
    email: string;
    role: string;
    exp: number;
}

interface AuthContextType {
    user: User | null;
    login: (access_token: string, refresh_token: string) => void;
    logout: () => void;
    hasRole: (role: string[]) => boolean;
    refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const decodeAndSetUser = (access_token: string) => {
        try {
            const decoded: User = jwtDecode(access_token);
            setUser(decoded);
        } catch (error) {
            console.error("Error decoding token:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            try {
                const decoded: User = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                    removeTokens();
                    setUser(null);
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                removeTokens();
            }
        }
    }, []);

    const login = (access_token: string, refresh_token: string) => {
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        decodeAndSetUser(access_token);
    };

    const logout = () => {
        removeTokens();
        setUser(null);
    };

    const refresh = useCallback(async (): Promise<void> => {
        const refresh_token = getRefreshToken();
        if (!refresh_token) {
            logout();
            return;
        }
        try {
            const { data } = await refreshTokenRequest(refresh_token);
            if (data && data.access_token) {
                setAccessToken(data.access_token);
                setRefreshToken(data.refresh_token);
                decodeAndSetUser(data.access_token);
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            logout();
        }
    }, []);

    const hasRole = (role: string[]): boolean => {
        return user ? role.includes(user.role) : false;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasRole, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};