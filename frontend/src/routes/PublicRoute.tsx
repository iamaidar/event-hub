import { ReactNode, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PublicRouteProps {
    children: ReactNode;
}

// Функция для определения маршрута на основе роли пользователя
const getRedirectPath = (role: string): string => {
    switch (role) {
        case "admin":
            return "/admin";
        case "user":
            return "/dashboard";
        default:
            return "/dashboard";
    }
};

const PublicRoute = ({ children }: PublicRouteProps) => {
    const authContext = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authContext) {
            setLoading(false);
        }
    }, [authContext]);

    if (loading) {
        return <div>Loading...</div>; // Показываем спиннер, пока загружается `authContext`
    }

    if (authContext?.user) {
        console.log("✅ User detected:", authContext.user);

        const lastVisitedRoute = localStorage.getItem("lastVisitedRoute") || "";
        const publicRoutes = ["/login", "/register"];
        const userRole = authContext.user.role;
        const roleBasedRedirect = getRedirectPath(userRole);

        // Если последний маршрут не публичный, редиректим туда, иначе на страницу по роли
        const targetRoute = publicRoutes.includes(lastVisitedRoute) ? roleBasedRedirect : lastVisitedRoute;

        console.log("🔄 Redirecting user to:", targetRoute);
        return <Navigate to={targetRoute} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
