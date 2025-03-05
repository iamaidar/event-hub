import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader.tsx";
import AdminFooter from "../components/admin/AdminFooter.tsx";

const AdminLayout = () => {
    return (
        <div>
            <AdminHeader />
            <div className="p-4">
                <Outlet />
            </div>
            <AdminFooter />
        </div>
    );
};

export default AdminLayout;
