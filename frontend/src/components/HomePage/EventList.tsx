import EventCard, { EventCardProps } from "../../UI/EventCard";
import { useState } from "react";

interface EventListProps {
    initialEvents?: EventCardProps[];
    title: string;
}

const EventList: React.FC<EventListProps> = ({ initialEvents = [], title }) => {
    const [events] = useState<EventCardProps[]>(initialEvents);

    return (
        <section className="mt-8 p-4">
            <h3 className="text-2xl font-bold text-center">{title}</h3>
            <div className="mt-4">
                {events.map((event, index) => (
                    <EventCard key={index} {...event} />
                ))}
            </div>
        </section>
    );
};

export default EventList;

