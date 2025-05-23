import React, {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {fetchCategories} from "../../../api/categoryApi.tsx";
import EventForm from "../../../components/organizer/event/EventForm.tsx";
import { fetchOrganizerEventById, updateOrganizerEvent} from "../../../api/organizerEventApi.tsx";

interface Category {
    id: number;
    name: string;
}

const EventEdit: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null,
    );

    // Form fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState(0);
    const [totalTickets, setTotalTickets] = useState(0);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchOrganizerEventById(id)
                .then((data) => {
                    setTitle(data.title);
                    setDescription(data.description || "");
                    setDateTime(new Date(data.date_time).toISOString().slice(0, 16));
                    setLocation(data.location);
                    setPrice(data.price);
                    setTotalTickets(data.total_tickets);
                    setImageBase64(data.image_base64);
                    const categoryId = data.category?.id ?? null;
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
            price: Number(price), // Убедимся, что price - число
            total_tickets: Number(totalTickets), // Убедимся, что total_tickets - число
            image_base64: imageBase64, // Передаем base64 строку изображения
            categoryId: selectedCategoryId ?? null,
        };

        console.log("🟡 Sending event update:", updatedEvent);

        if (id) {
            updateOrganizerEvent(id, updatedEvent)
                .then(() => {
                    console.log("✅ Event updated successfully!");
                    navigate("/organizer/events");
                })
                .catch((error) => {
                    console.error(
                        "❌ Error updating event:",
                        error.response?.data || error,
                    );
                    alert(
                        "Error updating event: " +
                        (error.response?.data?.message.join(", ") || "Unknown error"),
                    );
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
                imageBase64={imageBase64}
                setImageBase64={setImageBase64}
                onSubmit={handleSubmit}
                submitButtonText="Update Event"
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
            />
        </div>
    );
};

export default EventEdit;