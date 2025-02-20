import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/LoginForm";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import PublicRoute from "./routes/PublicRoute.tsx";
import RegistrationForm from "./pages/RegistrationForm.tsx";

// Компонент для защиты логина (если пользователь авторизован, редирект на /dashboard)


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <main className="min-h-screen bg-gray-100">
                    <Routes>
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><RegistrationForm/></PublicRoute>}></Route>
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
};

export default App;