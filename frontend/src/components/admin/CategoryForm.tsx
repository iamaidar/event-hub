import React from "react";

interface CategoryFormProps {
    name: string;
    setName: (value: string) => void;
    description: string;
    setDescription: (value: string) => void;
    is_verified: boolean;
    setIsVerified: (value: boolean) => void;
    imageBase64: string | null;
    setImageBase64: (value: string | null) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitButtonText: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
                                                       name,
                                                       setName,
                                                       description,
                                                       setDescription,
                                                       is_verified,
                                                       setIsVerified,
                                                       imageBase64,
                                                       setImageBase64,
                                                       onSubmit,
                                                       submitButtonText,
                                                   }) => {

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white text-gray-800 rounded-xl shadow-lg">
            <h2 className="text-3xl font-semibold mb-6 text-center">Category Management</h2>
            <form onSubmit={onSubmit} className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-gray-700">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full border px-4 py-3 rounded-lg bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                    />
                    {imageBase64 && <img src={imageBase64} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />}
                </div>

                {/* Verified */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={is_verified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                        className="mr-3"
                    />
                    <span className="text-gray-700">Verified</span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                    {submitButtonText}
                </button>
            </form>
        </div>
    );
};

export default CategoryForm;
