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
        return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8">{error}</div>;
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                Мероприятие не найдено.
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
            <p className="mb-2"><strong>Описание:</strong> {event.description}</p>
            <p className="mb-2">
                <strong>Дата и время:</strong> {new Date(event.date_time).toLocaleString()}
            </p>
            <p className="mb-2"><strong>Место проведения:</strong> {event.location}</p>
            {event.category && (
                <p className="mb-2"><strong>Категория:</strong> {event.category.name}</p>
            )}
            <p className="mb-2"><strong>Цена:</strong> {event.price} руб.</p>
            <p className="mb-2"><strong>Общее количество билетов:</strong> {event.total_tickets}</p>
            <p className="mb-2"><strong>Статус:</strong> {event.status}</p>
            {typeof event.is_verified === "boolean" && (
                <p className="mb-2"><strong>Проверено:</strong> {event.is_verified ? "Да" : "Нет"}</p>
            )}
            <Link
                to="/admin/events"
                className="text-blue-500 hover:underline mt-4 inline-block"
            >
                Вернуться к списку мероприятий
            </Link>
        </div>
    );
};

export default EventDetail;

