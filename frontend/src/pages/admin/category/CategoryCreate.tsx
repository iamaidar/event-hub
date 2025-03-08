import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../../api/categoryApi";
import CategoryForm from "../../../components/admin/CategoryForm";

const CategoryCreate: React.FC = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [is_verified, setIsVerified] = useState(false);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory({ name, description, is_verified, imageBase64 });
            navigate("/admin/categories");
        } catch (error) {
            alert("Error creating category");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold">Create Category</h1>
            <CategoryForm
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                is_verified={is_verified}
                setIsVerified={setIsVerified}
                imageBase64={imageBase64}
                setImageBase64={setImageBase64}
                onSubmit={handleSubmit}
                submitButtonText="Create Category"
            />
        </div>
    );
};

export default CategoryCreate;
