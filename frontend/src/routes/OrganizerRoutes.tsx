import { Route, Outlet } from "react-router-dom";
import OrganizerDashboardPage from "../pages/organizer/OrganizerDashboardPage";
import EventList from "../pages/organizer/event/EventDetail";
import EventCreate from "../pages/organizer/event/EventCreate";
import QRVerification from "../pages/organizer/ QRVerification.tsx";

const OrganizerRoutes = () => {
    return (
        <>
            <Route element={<Outlet />}>
                {/* Дашборд */}
                <Route index element={<OrganizerDashboardPage />} />
                {/* Верификация */}
                <Route path="../t/:id" element={<QRVerification />} />

                {/* Мероприятия */}
                <Route path="events" element={<EventList />} />
                <Route path="events/create" element={<EventCreate />} />
                {/* <Route path="events/edit/:id" element={<EventEdit />} /> */}
                {/* <Route path="events/:id" element={<EventDetail />} /> */}
            </Route>
        </>
    );
};

export default OrganizerRoutes;
