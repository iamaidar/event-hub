import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const authContext = useContext(AuthContext);

    if (authContext && authContext.user) {
        // Редирект в зависимости от роли пользователя
        // if (authContext.user.role === "admin") {
            return <Navigate to="/admin" />;
        // }
        // return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
};

export default PublicRoute;