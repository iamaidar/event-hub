// src/App.tsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import PublicRoute from "./routes/PublicRoute";
import RegistrationForm from "./pages/RegistrationForm";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import LoginForm from "./pages/LoginForm";
import SearchResults from "./pages/SearchResults";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import EventList from "./pages/admin/event/EventList";
import EventCreate from "./pages/admin/event/EventCreate";
import EventEdit from "./pages/admin/event/EventEdit";
import EventDetail from "./pages/admin/event/EventDetail";
import PrivateRoute from "./routes/PrivateRoute";
import AdminLayout from "./layout/AdminLayout.tsx";

const AppContent = () => {
    const location = useLocation();
    // Если URL начинается с /admin, то мы в админской части
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Header />}
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
                            <PrivateRoute requiredRole="user">
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/home" element={<Home />} />
                    <Route path="/events" element={<SearchResults />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Админские маршруты с вложенным AdminLayout */}
                    <Route
                        path="/admin/*"
                        element={
                            <PrivateRoute requiredRole="admin">
                                <AdminLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="events" element={<EventList />} />
                        <Route path="events/create" element={<EventCreate />} />
                        <Route path="events/edit/:id" element={<EventEdit />} />
                        <Route path="events/:id" element={<EventDetail />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </main>
            {!isAdminRoute && <Footer />}
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;
