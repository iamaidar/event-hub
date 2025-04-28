import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventCard from "../UI/EventCard";
import { EventType, fetchPaginatedEvents } from "../api/eventApi";
import { fetchCategoryById } from "../api/categoryApi.tsx";

const CategoryEventsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);

    useEffect(() => {
        const loadEventsByCategory = async () => {
            try {
                if (!id) return;

                const [eventsResponse, categoryResponse] = await Promise.all([
                    fetchPaginatedEvents(1, 20, { categoryId: Number(id) }),
                    fetchCategoryById(Number(id))
                ]);

                setEvents(eventsResponse.data);
                setCategoryName(categoryResponse.name);
            } catch (err: any) {
                setError(err.message || "Failed to load events.");
            } finally {
                setLoading(false);
            }
        };

        loadEventsByCategory();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-10">Loading events...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-500">{error}</p>;
    }

    if (events.length === 0) {
        return (
            <section className="p-6">
                <h1 className="text-3xl font-bold text-center mb-8">
                    No events available for category "{categoryName ?? "Unknown"}"
                </h1>
            </section>
        );
    }

    return (
        <section className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">
                Events for "{categoryName ?? "this category"}"
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        location={event.location}
                        date_time={event.date_time}
                        image_base64={event.image_base64}
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoryEventsPage;
