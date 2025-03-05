import { ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface RoleProtectedRouteProps {
    children: ReactNode;
    requiredRole: string;
}

const PrivateRoute = ({ children, requiredRole }: RoleProtectedRouteProps) => {
    const authContext = useContext(AuthContext);
    const location = useLocation();

    // Если состояние загрузки (если оно у вас реализовано), можно показывать спиннер
    if (!authContext) {
        return <div>Loading...</div>;
    }
    console.log(location);
    // Если пользователь не авторизован, перенаправляем на страницу логина и сохраняем текущий маршрут
    if (!authContext.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Проверяем наличие требуемой роли у пользователя
    if (!authContext.hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;