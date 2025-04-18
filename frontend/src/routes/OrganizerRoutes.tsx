import {Route, Outlet} from "react-router-dom";
import OrganizerDashboardPage from "../pages/organizer/OrganizerDashboardPage";
import EventCreate from "../pages/organizer/event/EventCreate";
import EventList from "../pages/organizer/event/EventList.tsx";
import EventEdit from "../pages/organizer/event/EventEdit.tsx";
import EventDetail from "../pages/organizer/event/EventDetail.tsx";

const OrganizerRoutes = () => {
    return (
        <>
            <Route element={<Outlet/>}>
                {/* Дашборд */}
                <Route index element={<OrganizerDashboardPage/>}/>
                {/* Верификация */}

                {/* Мероприятия */}
                <Route path="events" element={<EventList/>}/>
                <Route path="events/create" element={<EventCreate/>}/>
                <Route path="events/edit/:id" element={<EventEdit/>}/>
                <Route path="events/:id" element={<EventDetail/>}/>
            </Route>
        </>
    );
};

export default OrganizerRoutes;
