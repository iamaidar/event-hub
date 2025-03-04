import {
    BrowserRouter as Router,
        Routes,
        Route,
        Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import PublicRoute from "./routes/PublicRoute";
import RegistrationForm from "./pages/RegistrationForm";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import SearchResults from "./pages/SearchResults";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import RoleProtectedRoute from "./routes/RoleProtectedRoute.tsx";
import EventPage from "./pages/admin/EventsPage.tsx";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <main className="min-h-screen bg-gray-100">
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <LoginForm isLogin={true} />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <RegistrationForm />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/home" element={<Home />} />
                        <Route path="/events" element={<SearchResults />} />
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                        <Route
                            path="/admin"
                            element={
                                <RoleProtectedRoute requiredRole="admin">
                                    <EventPage></EventPage>
                                </RoleProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
};

export default App;
