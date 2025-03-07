import { Outlet } from "react-router-dom";
import AdminFooter from "../components/admin/AdminFooter.tsx";
import AdminHeader from "../components/admin/AdminHeader.tsx";

const AdminLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Фиксированный Header */}
            <AdminHeader />

            {/* Контентная область занимает оставшееся пространство */}
            <main className="flex-grow p-4">
                <Outlet />
            </main>

            {/* Фиксированный Footer */}
            <AdminFooter />
        </div>
    );
};

export default AdminLayout;
