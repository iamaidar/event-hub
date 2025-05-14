import React, { useState, useContext, useEffect } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // Функция для определения маршрута на основе роли
  const getRedirectPath = (role: string) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "user":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  };

  // 🔹 Редиректим пользователя после успешного логина
  useEffect(() => {
    if (authContext?.user) {
      navigate(getRedirectPath(authContext.user.role), { replace: true });
    }
  }, [authContext?.user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await login(email, password);
      if (!response.data.access_token || !response.data.refresh_token) {
        throw new Error("Invalid tokens received from the server");
      }

      authContext?.login(
        response.data.access_token,
        response.data.refresh_token,
      );
      setSuccessMessage("Login successful! Redirecting...");
    } catch (error: any) {
      console.error("Authentication error:", error);
      if (error.response) {
        setError(error.response.data.message || "Server error");
      } else if (error.request) {
        setError("Server is not responding. Please try again later.");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full max-w-xs px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          {/* Кастомная SVG-иконка Google */}
          <svg
            className="w-6 h-6 mr-2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.31 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.52 7.66 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.66 1 4.01 3.48 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
