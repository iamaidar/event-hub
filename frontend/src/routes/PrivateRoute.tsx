import { ReactNode, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PrivateRouteProps {
    children: ReactNode;
    requiredRoles: string[];
}

const PrivateRoute = ({ children, requiredRoles }: PrivateRouteProps) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authContext) {
            setLoading(false);
        }
    }, [authContext]);

    if (loading) {
        return <div>Loading...</div>; // Показываем спиннер, пока загружается `authContext`
    }

    if (!authContext?.user) {
        localStorage.setItem("lastVisitedRoute", location.pathname); // Сохраняем маршрут перед редиректом
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!authContext.hasRole(requiredRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;