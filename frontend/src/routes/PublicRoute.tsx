// src/routes/PublicRoute.tsx
import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const authContext = useContext(AuthContext);

    if (authContext && authContext.user) {
        // Читаем последний посещённый маршрут из localStorage
        const lastVisitedRoute = localStorage.getItem("lastVisitedRoute");
        // Список публичных маршрутов, где редирект не требуется (например, логин и регистрация)
        const publicRoutes = ["/login", "/register"];
        const defaultRoute = "/dashboard"; // или другой маршрут по умолчанию

        // Если lastVisitedRoute существует и не является публичным, перенаправляем туда,
        // иначе перенаправляем на defaultRoute
        const targetRoute =
            lastVisitedRoute && !publicRoutes.includes(lastVisitedRoute)
                ? lastVisitedRoute
                : defaultRoute;
        return <Navigate to={targetRoute} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;
