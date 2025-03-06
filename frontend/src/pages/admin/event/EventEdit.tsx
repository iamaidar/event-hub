import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  fetchEventById, updateEvent } from "../../../api/eventApi.tsx";

const EventEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Поля формы
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [price, setPrice] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);
    const [status, setStatus] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEventById(id)
                .then((data) => {
                    setTitle(data.title);
                    setDescription(data.description || "");
                    setDateTime(new Date(data.date_time).toISOString().slice(0, 16));
                    setLocation(data.location);
                    setCategoryName(data.category ? data.category.name : "");
                    setPrice(data.price);
                    setTotalTickets(data.total_tickets);
                    setStatus(data.status);
                    setIsVerified(data.is_verified || false);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Ошибка при загрузке данных мероприятия");
                    setLoading(false);
                });
        }
    }, [id]);

import React, { useState } from "react";
import CategoryForm from "../../../components/Admin/CategoryForm.tsx"; // Ensure the path is correct

const CategoryEdit: React.FC = () => {
    // States for category
    const [name, setName] = useState("Category Name");
    const [imageUrl, setImageUrl] = useState<string>(""); // Storing the image URL
    const [status, setStatus] = useState("Active");

    // Function to handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedEvent = {
            title,
            description,
            date_time: dateTime,
            location,
            price,
            total_tickets: totalTickets,
        alert("Form submitted with new data");
        console.log({
            name,
            imageUrl,
            status,
            is_verified: isVerified,
            ...(categoryName && { category: { id: 0, name: categoryName } }),
        };

        if (id) {
            updateEvent(id, updatedEvent)
                .then(() => {
                    navigate("/admin/events");
                })
                .catch(() => {
                    alert("Ошибка при обновлении мероприятия");
                });
        }
        });
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8">{error}</div>;
    }
    // Function to handle the image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImageUrl(reader.result as string); // Update the image URL state
                }
            };
            reader.readAsDataURL(file); // Convert the image file to a base64 URL
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Редактировать мероприятие</h1>
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Сохранить изменения
                </button>
            </form>
        </div>
            <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

            {/* Image input field */}
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700" htmlFor="image">
                    Category Image
                </label>
                <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    className="mt-1 block w-full text-sm text-gray-500"
                    accept="image/*" // Ensures only images can be selected
                />
                {imageUrl && (
                    <div className="mt-4">
                        <img src={imageUrl} alt="Category Preview" className="max-w-xs" />
                    </div>
                )}
            </div>

            {/* Pass states and submit function to CategoryForm */}
            <CategoryForm
                name={name}
                imageUrl={imageUrl}
                status={status}
                setName={setName}
                setImageUrl={setImageUrl}
                setStatus={setStatus}
                onSubmit={handleSubmit}
                submitButtonText="Save Changes"
            />
        </div>
    );
};

export default EventEdit;
export default CategoryEdit;
