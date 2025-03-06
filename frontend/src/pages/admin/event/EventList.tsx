import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPaginatedEvents, deleteEvent, EventType } from "../../../api/eventApi";
import EventTable from "../../../components/EventTable.tsx";
import Button from "../../../UI/Button.tsx";

const EventList: React.FC = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const loadEvents = (page: number) => {
        setLoading(true);
        fetchPaginatedEvents(page, 10)
            .then((result) => {
                console.log(result);
                setEvents(result.data);
                setCurrentPage(result.page);
                setTotalPages(result.totalPages);
                setLoading(false);
            })
            .catch(() => {
                setError("Error loading events");
                setLoading(false);
            });
    };

    useEffect(() => {
        loadEvents(currentPage);
    }, [currentPage]);

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleDelete = (id: number | string) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            deleteEvent(id)
                .then(() => {
                    setEvents(events.filter((event) => event.id !== id));
                })
                .catch(() => {
                    alert("Error deleting event");
                });
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Events</h1>
            <Link
                to="/admin/events/create"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Create Event
            </Link>
            <ul className="mt-4 space-y-4">
                {events.map((event) => (
                    <li key={event.id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">{event.title}</h2>
                        <p>{event.description}</p>
                        <p>
                            <strong>Date & Time:</strong>{" "}
                            {new Date(event.date_time).toLocaleString()}
                        </p>
                        <p>
                            <strong>Location:</strong> {event.location}
                        </p>
                        <p>
                            <strong>Price:</strong> {event.price} USD
                        </p>
                        <p>
                            <strong>Status:</strong> {event.status}
                        </p>
                        <div className="mt-2">
                            <Link
                                to={`/admin/events/${event.id}`}
                                className="text-green-500 hover:underline mr-2"
                            >
                                Details
                            </Link>
                            <Link
                                to={`/admin/events/edit/${event.id}`}
                                className="text-blue-500 hover:underline mr-2"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-center mt-8 space-x-4">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <div className="flex space-x-2">
                    {Array.from({length: totalPages}, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-3 py-1 border rounded ${
                                currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-white text-black"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="container mx-auto px-4 py-8 relative">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Events</h1>
                    <Button text="Create Event" to="/admin/events/create" variant="green"/>
                </div>

                <EventTable/>
            </div>
        </div>);
};
export default EventList;
