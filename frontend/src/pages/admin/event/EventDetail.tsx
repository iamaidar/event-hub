import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EventType, fetchEventById } from "../../../api/eventApi.tsx";

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

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-blue-100 text-blue-700",
            published: "bg-yellow-100 text-yellow-700",
            completed: "bg-green-100 text-green-700",
            cancelled: "bg-orange-100 text-orange-700",
            inactive: "bg-zinc-200 text-zinc-600",
            deleted: "bg-neutral-300 text-neutral-600",
        };
        return (
            <span
                className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    colors[status] || "bg-gray-200 text-gray-600"
                }`}
            >
        {status}
      </span>
        );
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8">{error}</div>;
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">Event not found.</div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">{event.title}</h1>
                <div className="space-y-3 text-gray-700">
                    <p className="border-b pb-2">
                        <strong>Description:</strong> {event.description}
                    </p>
                    <p className="border-b pb-2">
                        <strong>Date & Time:</strong>{" "}
                        {new Date(event.date_time).toLocaleString()}
                    </p>
                    <p className="border-b pb-2">
                        <strong>Location:</strong> {event.location}
                    </p>
                    {event.category && (
                        <p className="border-b pb-2">
                            <strong>Category:</strong> {event.category.name}
                        </p>
                    )}
                    <p className="border-b pb-2">
                        <strong>Price:</strong> {event.price} RUB
                    </p>
                    <p className="border-b pb-2">
                        <strong>Total Tickets:</strong> {event.total_tickets}
                    </p>
                    <p className="border-b pb-2">
                        <strong>Status:</strong> {getStatusBadge(event.status)}
                    </p>
                    <p>
                        <strong>Verified:</strong>{" "}
                        {event.is_verified ? (
                            <span className="text-green-600 font-semibold">✅ Yes</span>
                        ) : (
                            <span className="text-red-500 font-semibold">❌ No</span>
                        )}
                    </p>
                    {event.image_base64 ? (
                        <img
                            src={event.image_base64}
                            alt={event.title}
                            className="rounded-lg mt-4"
                        />
                    ) : (
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Placeholder"
                            className="rounded-lg mt-4"
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

