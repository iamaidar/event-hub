import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  removeTokens,
  getRefreshToken,
} from "../utils/tokenService";
import { refreshTokenRequest } from "../api/authApi";
import { jwtDecode } from "jwt-decode";

interface User {
  sub: number;
   name: string;
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
      console.log("✅ Decoded user:", decoded);
      setUser(decoded);
    } catch (error) {
      console.error("❌ Error decoding token:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const decoded: User = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            console.log("⏳ Access token expired, trying refresh...");
            await refresh();
          } else {
            console.log("✅ Token valid, setting user:", decoded);
            setUser(decoded);
          }
        } catch (error) {
          console.error("❌ Error decoding token:", error);
          removeTokens();
        }
      }
    };
    initializeAuth();
  }, []);

  const login = (access_token: string, refresh_token: string) => {
    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    const decoded: User = jwtDecode(access_token);
    console.log("✅ Setting user in AuthContext:", decoded);
    setUser(decoded);

    // Принудительно обновляем `user`
    setTimeout(() => {
      setUser(decoded);
    }, 0);
  };

  const logout = () => {
    console.log("🔴 Logging out...");
    removeTokens();
    setUser(null);
  };

  const refresh = useCallback(async (): Promise<void> => {
    const refresh_token = getRefreshToken();
    if (!refresh_token) {
      console.log("🚨 No refresh token found, logging out...");
      removeTokens();
      logout();
      return;
    }
    try {
      console.log("🔄 Refreshing token...");
      const { data } = await refreshTokenRequest(refresh_token);
      if (data && data.access_token) {
        console.log("✅ Token refreshed!");
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        decodeAndSetUser(data.access_token);
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      removeTokens();
      logout();
    }
  }, []);

  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};
