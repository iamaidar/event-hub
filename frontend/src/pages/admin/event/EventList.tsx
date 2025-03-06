import EventTable from "../../../components/EventTable.tsx";
import Button from "../../../UI/Button.tsx";

interface EventListProps {}

const EventList: React.FC<EventListProps> = () => {
    return (
        <div className="container mx-auto px-4 py-8 relative">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Events</h1>
                <Button text="Create Event" to="/admin/events/create" variant="green" />
            </div>

            <EventTable />
        </div>
    );
};

export default EventList;

