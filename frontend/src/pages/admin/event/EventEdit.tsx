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
        alert("Form submitted with new data");
        console.log({
            name,
            imageUrl,
            status,
        });
    };

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

export default CategoryEdit;
