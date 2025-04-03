import { Routes, Route } from "react-router-dom";
import OrganizerLayout from "../layout/OrganizerLayout";
import OrganizerDashboardPage from "../pages/organizer/OrganizerDashboardPage";
import PrivateRoute from "./PrivateRoute.tsx";
import QRVerification from "../pages/organizer/ QRVerification.tsx";
import EventList from "../pages/organizer/event/EventDetail.tsx";


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

                <Route path="/organizer/*">
                    <Route path="events" element={<EventList/>}/>
                    <Route path="events/create" element={<EventCreate/>}/>
                    {/*<Route path="events/edit/:id" element={<EventEdit/>}/>*/}
                    {/*<Route path="events/:id" element={<EventDetail/>}/>*/}
                </Route>
            </Route>
        </Routes>
    );
};

export default OrganizerRoutes;
