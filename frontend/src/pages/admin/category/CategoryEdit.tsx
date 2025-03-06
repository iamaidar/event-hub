import React, { useState } from "react";
import CategoryForm from "../../../components/Admin/CategoryForm.tsx"; // Убедитесь, что путь правильный

const CategoryEdit: React.FC = () => {
    // Состояния для категории
    const [name, setName] = useState("Category Name");
    const [imageUrl, setImageUrl] = useState<string>(""); // Хранение URL изображения
    const [status, setStatus] = useState("Active");

    // Функция для обработки отправки формы
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Form submitted with new data");
        console.log({
            name,
            imageUrl,
            status,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Edit Category</h1>

            {/* Передаем состояния и функцию submit в компонент CategoryForm */}
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

export default CategoryEdit;
