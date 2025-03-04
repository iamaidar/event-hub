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

import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import EventList from "./pages/admin/event/EventList.tsx";
import EventCreate from "./pages/admin/event/EventCreate.tsx";
import EventEdit from "./pages/admin/event/EventEdit.tsx";
import EventDetail from "./pages/admin/event/EventDetail.tsx";

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
                        <Route
                            path="/admin"
                            element={
                                <RoleProtectedRoute requiredRole="admin">
                                    <AdminDashboardPage />
                                </RoleProtectedRoute>
                            }
                        />
                        {/* CRUD маршруты для управления мероприятиями */}
                        <Route
                            path="/admin/events"
                            element={
                                <RoleProtectedRoute requiredRole="admin">
                                    <EventList />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/events/create"
                            element={
                                <RoleProtectedRoute requiredRole="admin">
                                    <EventCreate />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/events/edit/:id"
                            element={
                                <RoleProtectedRoute requiredRole="admin">
                                    <EventEdit />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/events/:id"
                            element={
                                <RoleProtectedRoute requiredRole="admin">
                                    <EventDetail />
                                </RoleProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
};

export default App;
