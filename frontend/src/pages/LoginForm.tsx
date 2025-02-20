import React, { useState, useContext, useEffect } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    // Check if user is already logged in and redirect
    useEffect(() => {
        if (authContext?.user) {
            navigate("/dashboard", { replace: true });
        }
    }, [authContext?.user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!email || !password) {
                console.error("Email и пароль не могут быть пустыми");
                return;
            }

            // Get token using email and password
            const { token } = await login();
            authContext?.login(token); // Login via context
            navigate("/dashboard"); // Redirect after login
        } catch (error) {
            console.error("Ошибка входа:", error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Вход</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
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
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;