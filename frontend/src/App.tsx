import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useContext } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./pages/LoginForm";
import RegistrationForm from "./pages/RegistrationForm";
import OrderPage from "./pages/user/OrderPage";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import AuthCallback from "./pages/AuthCallback";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { setupAxiosInterceptors } from "./api/axiosInstance";
import ViewDetails from "./pages/user/ViewDetails.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin pages
import AdminDashboardPage from "./pages/admin/main/AdminDashboardPage";
import UserList from "./pages/admin/user/UserList";
import UserCreate from "./pages/admin/user/UserCreate";
import UserEdit from "./pages/admin/user/UserEdit";
import UserDetail from "./pages/admin/user/UserDetail";
import AdminLayout from "./layout/AdminLayout";
import EventList from "./pages/admin/event/EventList";
import EventCreate from "./pages/admin/event/EventCreate";
import EventEdit from "./pages/admin/event/EventEdit";
import EventDetail from "./pages/admin/event/EventDetail";
import CategoryList from "./pages/admin/category/CategoryList";
import CategoryCreate from "./pages/admin/category/CategoryCreate";
import CategoryEdit from "./pages/admin/category/CategoryEdit";
import CategoryDetail from "./pages/admin/category/CategoryDetail.tsx";
import ReviewList from "./pages/admin/review/ReviewList.tsx";

// Other pages
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import OrganizerRoutes from "./routes/OrganizerRoutes";
import OrganizerLayout from "./layout/OrganizerLayout.tsx";
import QRVerification from "./pages/organizer/ QRVerification.tsx";
import MyGroupsPage from "./pages/user/profile/MuGroupPage.tsx";
import MyProfilePage from "./pages/user/profile/MyProfilePage.tsx";
import MyTicketsPage from "./pages/user/profile/MyTicketsPage.tsx";
import ProfilePage from "./components/homepage/ ProfilePage.tsx";
import GroupChat from "./components/user/GroupChat.tsx";
import AboutUsPage from "./pages/AboutUsPage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import CategoryEventsPage from "./pages/CategoryEventsPage.tsx";

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
  const isOrganizerRoute =
    location.pathname.startsWith("/organizer") ||
    location.pathname.startsWith("/t");

  return (
    <>
      {!isAdminRoute && !isOrganizerRoute && <Header />}
      <main className="min-h-screen bg-gray-100">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/categories/:id" element={<CategoryEventsPage />} />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegistrationForm />
              </PublicRoute>
            }
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<SearchResults />} />
          <Route path="/details/:id" element={<ViewDetails />} />
          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              <PrivateRoute requiredRoles={["user"]}>
                <Routes>
                  <Route path="orders/my" element={<OrderPage />} />
                  <Route path="payment-success" element={<PaymentSuccess />} />
                  <Route path="profile" element={<ProfilePage />}>
                    <Route index element={<Navigate to="my-info" replace />} />
                    <Route path="my-info" element={<MyProfilePage />} />
                    <Route path="my-tickets" element={<MyTicketsPage />} />
                    <Route path="my-groups" element={<MyGroupsPage />} />
                  </Route>{" "}
                  <Route
                    path="payment-cancel"
                    element={<p>❌ Payment is not completed</p>}
                  />
                  {/* Public Routes */}
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
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/events" element={<SearchResults />} />
                  <Route path="/details/:id" element={<ViewDetails />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  {/* User Routes */}
                  <Route
                    path="/user/*"
                    element={
                      <PrivateRoute requiredRoles={["user"]}>
                        <Routes>
                          <Route path="orders/my" element={<OrderPage />} />
                          <Route
                            path="payment-success"
                            element={<PaymentSuccess />}
                          />
                          <Route path="profile" element={<ProfilePage />} />

                          <Route
                            path="payment-cancel"
                            element={<p>❌ Payment is not completed</p>}
                          />
                          <Route
                            path="chat/:id"
                            element={<GroupChat />}
                          ></Route>
                        </Routes>
                      </PrivateRoute>
                    }
                  />
                  {/* Admin Layout Routes */}
                  <Route
                    path="/admin/*"
                    element={
                      <PrivateRoute requiredRoles={["admin"]}>
                        <AdminLayout />
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="events" element={<EventList />} />
                    <Route path="events/create" element={<EventCreate />} />
                    <Route path="events/edit/:id" element={<EventEdit />} />
                    <Route path="events/:id" element={<EventDetail />} />

                    <Route path="categories" element={<CategoryList />} />
                    <Route
                      path="categories/create"
                      element={<CategoryCreate />}
                    />
                    <Route
                      path="categories/edit/:id"
                      element={<CategoryEdit />}
                    />
                    <Route path="categories/:id" element={<CategoryDetail />} />

                    <Route path="reviews" element={<ReviewList />} />

                    <Route path="users" element={<UserList />} />
                    <Route path="users/create" element={<UserCreate />} />
                    <Route path="users/edit/:id" element={<UserEdit />} />
                    <Route path="users/:id" element={<UserDetail />} />
                  </Route>
                  {/* Organizer Layout Routes */}
                  <Route
                    path="/organizer/*"
                    element={
                      <PrivateRoute requiredRoles={["organizer"]}>
                        <OrganizerLayout />
                      </PrivateRoute>
                    }
                  >
                    {OrganizerRoutes()}{" "}
                    {/* ⬅ вызываем как функцию, не компонент */}
                  </Route>
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </PrivateRoute>
            }
          />
          <Route
            path="/t/:id"
            element={
              <PrivateRoute requiredRoles={["organizer"]}>
                <QRVerification />
              </PrivateRoute>
            }
          />

          {/* Admin Layout Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute requiredRoles={["admin"]}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="events" element={<EventList />} />
            <Route path="events/create" element={<EventCreate />} />
            <Route path="events/edit/:id" element={<EventEdit />} />
            <Route path="events/:id" element={<EventDetail />} />

            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/create" element={<CategoryCreate />} />
            <Route path="categories/edit/:id" element={<CategoryEdit />} />
            <Route path="categories/:id" element={<CategoryDetail />} />

            <Route path="reviews" element={<ReviewList />} />

            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="users/edit/:id" element={<UserEdit />} />
            <Route path="users/:id" element={<UserDetail />} />
          </Route>

          {/* Organizer Layout Routes */}
          <Route
            path="/organizer/*"
            element={
              <PrivateRoute requiredRoles={["organizer"]}>
                <OrganizerLayout />
              </PrivateRoute>
            }
          >
            {OrganizerRoutes()} {/* ⬅ вызываем как функцию, не компонент */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && !isOrganizerRoute && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
