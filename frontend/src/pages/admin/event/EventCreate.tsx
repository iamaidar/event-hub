import React, { useState } from "react";
import EventForm from "../../../components/Admin/EventForm.tsx";

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
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Form submitted (no functionality yet):\n
            Title: ${title}\n
            Description: ${description}\n
            DateTime: ${dateTime}\n
            Location: ${location}\n
            Category: ${categoryName}\n
            Price: ${price}\n
            Tickets: ${totalTickets}\n
            Status: ${status}\n
            Verified: ${isVerified}\n
            Image URL: ${imageUrl}`
        );
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
        </div>
    );
};

export default EventCreate;
