import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
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
import AdminLayout from "./layout/AdminLayout";
import { setupAxiosInterceptors } from "./api/axiosInstance";
import CategoryList from "./pages/admin/category/CategoryList.tsx";
import CategoryCreate from "./pages/admin/category/CategoryCreate.tsx";
import CategoryEdit from "./pages/admin/category/CategoryEdit.tsx";
import CategoryDetail from "./pages/admin/category/CategoryDetail.tsx";

const AppContent = () => {
    const location = useLocation();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (authContext) {
            setupAxiosInterceptors(authContext);
        }
    }, [authContext]);

    useEffect(() => {
        localStorage.setItem("lastVisitedRoute", location.pathname);
    }, [location.pathname]);

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
                                <LoginForm />
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
                            <PrivateRoute requiredRoles={['user']} >
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/home" element={<Home />} />
                    <Route path="/events" element={<SearchResults />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Админские маршруты */}
                    <Route
                        path="/admin/*"
                        element={
                            <PrivateRoute requiredRoles={['admin']}>
                                <AdminLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="events" element={<EventList />} />
                        <Route path="events/create" element={<EventCreate />} />
                        <Route path="events/edit/:id" element={<EventEdit />} />
                        <Route path="events/:id" element={<EventDetail />} />

                        <Route path="categories" element={<CategoryList/>}/>
                        <Route path="categories/create" element={<CategoryCreate/>}/>
                        <Route path="categories/edit/:id" element={<CategoryEdit/>}/>
                        <Route path="categories/:id" element={<CategoryDetail/>}/>

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
