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
                    setIsVerified(data.is_verified || false);
                    setImageUrl(data.image_url || "");
                    setSelectedCategoryId(data.categoryId ? data.categoryId : null);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Error loading event data.");
                    setLoading(false);
                });
        }

        // Fetch available categories
        fetchCategories()
            .then((data) => {
                setCategories(data);
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
            date_time: dateTime,
            location,
            price,
            total_tickets: totalTickets,
            status,
            is_verified: isVerified,
            image_url: imageUrl,
        };

        if (selectedCategoryId) {
            updatedEvent.categoryId =  selectedCategoryId ;
        }

        if (id) {
            updateEvent(id, updatedEvent)
                .then(() => {
                    navigate("/admin/events");
                })
                .catch(() => {
                    alert("Error updating event.");
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
