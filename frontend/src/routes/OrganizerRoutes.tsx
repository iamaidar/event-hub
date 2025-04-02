import { Routes, Route } from "react-router-dom";
import OrganizerLayout from "../layout/OrganizerLayout";
import OrganizerDashboardPage from "../pages/organizer/OrganizerDashboardPage";
import PrivateRoute from "./PrivateRoute.tsx";
import QRVerification from "../pages/organizer/ QRVerification.tsx";

const OrganizerRoutes = () => {
    return (
        <Routes>
            <Route
                element={
                    <PrivateRoute requiredRoles={["organizer"]}>
                        <OrganizerLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/organizer" element={<OrganizerDashboardPage />} />
                <Route path="/t/:id" element={<QRVerification />} />
            </Route>
        </Routes>
    );
};

export default OrganizerRoutes;
