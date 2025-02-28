import React, { useState, useContext, useEffect } from "react";
import { register, login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ isLogin }: { isLogin: boolean }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (authContext?.user) {
            navigate("/dashboard", { replace: true });
        }
    }, [authContext?.user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        if (!email || !password ||  (!isLogin && !username)) {
            setError("Все поля обязательны для заполнения");
            setLoading(false);
            return;
        }

        try {
            const response = isLogin ? await login(email, password) : await register(email, password, username);
            console.log(response);
            if (!response.data.access_token) {
                throw new Error("Недействительный токен");
            }

            authContext?.login(response.data.access_token);
            setSuccessMessage(isLogin ? "Вход успешен! Перенаправление..." : "Регистрация успешна! Перенаправление...");
            setAuthenticated(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error: any) {
            console.error("Ошибка аутентификации:", error);
            if (error.response) {
                setError(error.response.data.message || "Ошибка сервера");
            } else if (error.request) {
                setError("Сервер не отвечает. Попробуйте позже.");
            } else {
                setError("Произошла неизвестная ошибка");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {authenticated ? (
                <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
                    <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                    <p className="text-center text-blue-500 mt-4">{successMessage}</p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-bold text-center mb-4">{isLogin ? "Вход" : "Регистрация"}</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-gray-700">Имя пользователя</label>
                                <input
                                    type="text"
                                    placeholder="Введите имя пользователя"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input type="email"
                            placeholder="Введите email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Пароль</label>
                            <input
                                type="password"
                                placeholder="Введите пароль"
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
                            {loading ? (isLogin ? "Вход..." : "Регистрация...") : (isLogin ? "Войти" : "Зарегистрироваться")}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginForm;