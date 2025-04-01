import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // Сохраняем токены в localStorage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      // Перенаправляем на защищенную страницу
      navigate("/Home");
    } else {
      // Если токенов нет, возвращаем на страницу логина
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
};

export default AuthCallback;
