import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {createEvent} from "../../../api/eventApi.tsx";
import EventForm from "../../../components/admin/EventForm.tsx";

const EventCreate: React.FC = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [price, setPrice] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);
    const [status, setStatus] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Формируем объект для создания мероприятия.
        // Если у вас есть выбор категории с другими данными, можно адаптировать.
        const newEvent = {
            title,
            description,
            date_time: dateTime,
            location,
            price,
            total_tickets: totalTickets,
            status,
            is_verified: isVerified,
            // Если categoryName заполнено, передадим его в виде объекта (например, только имя)
            ...(categoryName && { category: { id: 0, name: categoryName } }),
        };

        createEvent(newEvent)
            .then(() => {
                navigate("/admin/events");
            })
            .catch((_err) => {
                alert("Ошибка при создании мероприятия");
            });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold">Create Event</h1>

            <EventForm
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                dateTime={dateTime}
                setDateTime={setDateTime}
                location={location}
                setLocation={setLocation}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                price={price}
                setPrice={(value) => setPrice(Number(value))}
                totalTickets={totalTickets}
                setTotalTickets={(value) => setTotalTickets(Number(value))}
                status={status}
                setStatus={setStatus}
                isVerified={isVerified}
                setIsVerified={setIsVerified}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                onSubmit={handleSubmit}
                submitButtonText="Create Event"
            />
            <h1 className="text-2xl font-bold mb-4">Создать мероприятие</h1>
            <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                <div>
                    <label className="block text-gray-700">Название</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Описание</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Дата и время</label>
                    <input
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Место проведения</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">
                        Категория (необязательно)
                    </label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Цена</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">
                        Общее количество билетов
                    </label>
                    <input
                        type="number"
                        value={totalTickets}
                        onChange={(e) => setTotalTickets(Number(e.target.value))}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Статус</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isVerified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                        className="mr-2"
                    />
                    <span className="text-gray-700">Проверено</span>
                </div>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Создать мероприятие
                </button>
            </form>
        </div>
    );
};

export default EventCreate;

