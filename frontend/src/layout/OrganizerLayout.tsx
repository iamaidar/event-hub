import { Outlet } from "react-router-dom";
import OrganizerHeader from "../components/organizer/OrganizerHeader.tsx";

const OrganizerLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Фиксированный Header */}
            <OrganizerHeader />

            {/* Контентная область занимает оставшееся пространство */}
            <main className="flex-grow p-4">
                <Outlet />
            </main>

        </div>
    );
};

export default OrganizerLayout;
