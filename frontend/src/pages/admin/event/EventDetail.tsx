import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {EventType, fetchEventById} from "../../../api/eventApi.tsx";

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<EventType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchEventById(id)
                .then((data) => {
                    setEvent(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Ошибка при загрузке данных мероприятия");
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8">{error}</div>;
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                Event not found.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">{event.title}</h1>
                <div className="space-y-3 text-gray-700">
                    <p className="border-b pb-2"><strong>Description:</strong> {event.description}</p>
                    <p className="border-b pb-2"><strong>Date & Time:</strong> {new Date(event.date_time).toLocaleString()}</p>
                    <p className="border-b pb-2"><strong>Location:</strong> {event.location}</p>
                    {event.category && (
                        <p className="border-b pb-2"><strong>Category:</strong> {event.category.name}</p>
                    )}
                    <p className="border-b pb-2"><strong>Price:</strong> {event.price} RUB</p>
                    <p className="border-b pb-2"><strong>Total Tickets:</strong> {event.total_tickets}</p>
                    <p className="border-b pb-2"><strong>Status:</strong>
                        <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                        {event.status}
                    </span>
                    </p>
                    <p><strong>Verified:</strong> {event.is_verified ? "✅ Yes" : "❌ No"}</p>
                    {event.image_base64 ? (
                        <img
                            src={event.image_base64}
                            alt={event.title}
                            className="rounded-lg"
                        />
                    ) : (
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Placeholder"
                            className="rounded-lg"
                        />
                    )}
                </div>
                <Link
                    to="/admin/events"
                    className="mt-6 inline-block bg-purple-500 text-white px-4 py-2 rounded-full shadow hover:bg-purple-600 transition"
                >
                    ← Back to Events List
                </Link>
            </div>
        </div>
    );
};

export default EventDetail;

