import React, { useState } from "react";
import CategoryForm from "../../../components/Admin/CategoryForm.tsx";

const CategoryCreate: React.FC = () => {
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState("Active");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(
            `Form submitted (no functionality yet):\n` +
            `Name: ${name}\n` +
            `Image URL: ${imageUrl}\n` +
            `Status: ${status}`
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold">Create Category</h1>

            <CategoryForm
                name={name}
                setName={setName}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                status={status}
                setStatus={setStatus}
                onSubmit={handleSubmit}
                submitButtonText="Create Category"
            />
        </div>
    );
};

export default CategoryCreate;
