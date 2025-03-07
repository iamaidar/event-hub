import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventById, updateEvent } from "../../../api/eventApi.tsx";
import { fetchCategories } from "../../../api/categoryApi.tsx";
import EventForm from "../../../components/admin/EventForm.tsx";

interface Category {
    id: number;
    name: string;
}

const EventEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);
    const [status, setStatus] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (id) {
            fetchEventById(id)
                .then((data) => {
                    setTitle(data.title);
                    setDescription(data.description || "");
                    setDateTime(new Date(data.date_time).toISOString().slice(0, 16));
                    setLocation(data.location);
                    setPrice(data.price);
                    setTotalTickets(data.total_tickets);
                    setStatus(data.status);
                    setIsVerified(Boolean(data.is_verified));
                    setImageUrl(data.image_url || "");

                    // 🛠 Если `category` объект, берем `category.id`
                    const categoryId = data.category?.id ?? null;
                    console.log("✅ Event category loaded:", categoryId);
                    setSelectedCategoryId(categoryId);

                    setLoading(false);
                })
                .catch((error) => {
                    console.error("❌ Error loading event data:", error);
                    setError("Error loading event data.");
                    setLoading(false);
                });
        }

        fetchCategories()
            .then((data) => {
                setCategories(data);
                console.log("✅ Categories loaded:", data);
            })
            .catch(() => {
                setError("Error fetching categories.");
            });
    }, [id]);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedEvent: any = {
            title,
            description,
            date_time: new Date(dateTime).toISOString(),
            location,
            price: Number(price), // 🛠 Убедимся, что price - число
            total_tickets: Number(totalTickets), // 🛠 Убедимся, что total_tickets - число
            status,
            is_verified: Boolean(isVerified), // 🛠 Передаем is_verified как true/false
            image_url: imageUrl,
            categoryId: selectedCategoryId ?? null,
        };

        console.log("🟡 Sending event update:", updatedEvent);

        if (id) {
            updateEvent(id, updatedEvent)
                .then(() => {
                    console.log("✅ Event updated successfully!");
                    navigate("/admin/events");
                })
                .catch((error) => {
                    console.error("❌ Error updating event:", error.response?.data || error);
                    alert("Error updating event: " + (error.response?.data?.message.join(", ") || "Unknown error"));
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
            <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
            <EventForm
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                dateTime={dateTime}
                setDateTime={setDateTime}
                location={location}
                setLocation={setLocation}
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
                submitButtonText="Save Changes"
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
            />
        </div>
    );
};

export default EventEdit;
