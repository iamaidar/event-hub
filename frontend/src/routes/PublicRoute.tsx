import { ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PublicRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const authContext = useContext(AuthContext);
    console.log(authContext);
    return authContext?.user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default PublicRoute;