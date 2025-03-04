import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface RoleProtectedRouteProps {
    children: ReactNode;
    requiredRole: string;
}

const RoleProtectedRoute = ({ children, requiredRole }: RoleProtectedRouteProps) => {
    const authContext = useContext(AuthContext);

    console.log(authContext?.user);
    console.log(1);
    // Если пользователь не авторизован, перенаправляем на страницу логина
    if (!authContext || !authContext.user) {
        return <Navigate to="/login" />;
    }
    console.log(2);


    // Для тестовой разработки: если у пользователя нет ролей, вручную устанавливаем "admin"
    const userRoles =
        authContext.user.roles && authContext.user.roles.length > 0
            ? authContext.user.roles
            : ["admin"];
    console.log(userRoles);
    // Проверяем наличие требуемой роли
    if (!userRoles.includes(requiredRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;
