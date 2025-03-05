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

        if (!email || !password || (!isLogin && !username)) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            const response = isLogin ? await login(email, password) : await register(email, password, username);
            console.log(response);
            if (!response.data.access_token) {
                throw new Error("Invalid token");
            }

            authContext?.login(response.data.access_token);
            setSuccessMessage(isLogin ? "Login successful! Redirecting..." : "Registration successful! Redirecting...");
            setAuthenticated(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
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

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            {authenticated ? (
                <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col items-center">
                    <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                    <p className="text-center text-blue-500 mt-4">{successMessage}</p>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 className="text-2xl font-bold text-center mb-4">{isLogin ? "Login" : "Register"}</h2>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-gray-700">Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="Enter email"
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
                                placeholder="Enter password"
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
                            {loading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Login" : "Register")}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginForm;
