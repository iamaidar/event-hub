import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, EventStatus } from "../../../api/eventApi.tsx";
import EventForm from "../../../components/admin/event/EventForm.tsx";
import { fetchCategories } from "../../../api/categoryApi.tsx";

interface Category {
  id: number;
  name: string;
}

const EventCreate: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [status, setStatus] = useState<EventStatus>("pending"); // 👈 начальный статус
  const [isVerified, setIsVerified] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories()
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((err: any) => {
        console.error("Error fetching categories", err);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent: any = {
      title,
      description,
      date_time: new Date(dateTime).toISOString(),
      location,
      price,
      total_tickets: totalTickets,
      status,
      is_verified: isVerified,
      image_base64: imageBase64,
      categoryId: selectedCategoryId || null,
    };

    if (selectedCategoryId) {
      newEvent.categoryId = selectedCategoryId;
    }
    console.log(newEvent);

    createEvent(newEvent)
      .then(() => {
        navigate("/admin/events");
      })
      .catch((_err) => {
        alert("Error creating event");
      });
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Event</h1>
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
            imageBase64={imageBase64}
            setImageBase64={setImageBase64}
            onSubmit={handleSubmit}
            submitButtonText="Create Event"
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
        />
      </div>
  );
};

export default EventCreate;
