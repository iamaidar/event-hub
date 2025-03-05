import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface RoleProtectedRouteProps {
    children: ReactNode;
    requiredRole: string;
}

const PrivateRoute = ({ children, requiredRole }: RoleProtectedRouteProps) => {
    const authContext = useContext(AuthContext);


    // Если пользователь не авторизован, перенаправляем на страницу логина
    if (!authContext || !authContext.user) {
        return <Navigate to="/login" />;
    }

    // Для тестовой разработки: всегда назначаем роль "admin"
    const userRoles = ["admin"];

    // Проверяем наличие требуемой роли
    if (!userRoles.includes(requiredRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
