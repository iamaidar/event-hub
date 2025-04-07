import React from "react";

interface Category {
    id: number;
    name: string;
}

interface EventFormProps {
    title: string;
    description: string;
    dateTime: string;
    location: string;
    price: number;
    totalTickets: number;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setDateTime: (value: string) => void;
    setLocation: (value: string) => void;
    setPrice: (value: number) => void;
    setTotalTickets: (value: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitButtonText: string;
    imageBase64: string | null;
    setImageBase64: (value: string | null) => void;
    categories: Category[];
    selectedCategoryId: number | null;
    setSelectedCategoryId: (value: number | null) => void;
}

const EventForm: React.FC<EventFormProps> = ({
                                                 title,
                                                 description,
                                                 dateTime,
                                                 location,
                                                 price,
                                                 totalTickets,
                                                 setTitle,
                                                 setDescription,
                                                 setDateTime,
                                                 setLocation,
                                                 setPrice,
                                                 setTotalTickets,
                                                 onSubmit,
                                                 submitButtonText,
                                                 imageBase64,
                                                 setImageBase64,
                                                 categories,
                                                 selectedCategoryId,
                                                 setSelectedCategoryId,
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
            <h2 className="text-3xl font-semibold mb-6 text-center">Event Management</h2>
            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                    />
                    {imageBase64 && (
                        <img
                            src={imageBase64}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mt-2"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-4 py-3 rounded-xl bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                    />
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700">Date & Time</label>
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700">Category</label>
                    <select
                        value={selectedCategoryId ?? ""}
                        onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Total Tickets</label>
                        <input
                            type="number"
                            value={totalTickets}
                            onChange={(e) => setTotalTickets(Number(e.target.value))}
                            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition"
                >
                    {submitButtonText}
                </button>
            </form>
        </div>
    );
};

export default EventForm;