import { Outlet } from "react-router-dom";
import AdminFooter from "../components/admin/AdminFooter.tsx";
import AdminHeader from "../components/admin/AdminHeader.tsx";

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
