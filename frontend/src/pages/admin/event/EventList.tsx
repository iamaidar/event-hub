import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {EventType ,deleteEvent, fetchEvents} from "../../../api/eventApi.tsx";

const EventList: React.FC = () => {
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents()
            .then((data:EventType[]) => {
                setEvents(data);
                setLoading(false);
            })
            .catch((_err) => {
                setError("Ошибка при загрузке мероприятий");
                setLoading(false);
            });
    }, []);

    const handleDelete = (id: number | string) => {
        if (window.confirm("Вы уверены, что хотите удалить мероприятие?")) {
            deleteEvent(id)
                .then(() => {
                    setEvents(events.filter((event) => event.id !== id));
                })
                .catch((_err) => {
                    alert("Ошибка при удалении");
                });
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Мероприятия</h1>
            <Link
                to="/admin/events/create"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Создать мероприятие
            </Link>
            <ul className="mt-4 space-y-4">
                {events.map((event) => (
                    <li key={event.id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">{event.title}</h2>
                        <p>{event.description}</p>
                        <p>
                            <strong>Дата и время:</strong> {new Date(event.date_time).toLocaleString()}
                        </p>
                        <p>
                            <strong>Место проведения:</strong> {event.location}
                        </p>
                        <p>
                            <strong>Цена:</strong> {event.price} руб.
                        </p>
                        <p>
                            <strong>Статус:</strong> {event.status}
                        </p>
                        <div className="mt-2">
                            <Link
                                to={`/admin/events/${event.id}`}
                                className="text-green-500 hover:underline mr-2"
                            >
                                Подробнее
                            </Link>
                            <Link
                                to={`/admin/events/edit/${event.id}`}
                                className="text-blue-500 hover:underline mr-2"
                            >
                                Редактировать
                            </Link>
                            <button
                                onClick={() => handleDelete(event.id!)}
                                className="text-red-500 hover:underline"
                            >
                                Удалить
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
