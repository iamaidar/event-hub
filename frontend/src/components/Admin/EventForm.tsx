import React from "react";

interface EventFormProps {
    title: string;
    description: string;
    dateTime: string;
    location: string;
    categoryName: string;
    price: number;
    totalTickets: number;
    status: string;
    isVerified: boolean;
    imageUrl: string;
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setDateTime: (value: string) => void;
    setLocation: (value: string) => void;
    setCategoryName: (value: string) => void;
    setPrice: (value: number) => void;
    setTotalTickets: (value: number) => void;
    setStatus: (value: string) => void;
    setIsVerified: (value: boolean) => void;
    setImageUrl: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitButtonText: string;
}

const EventForm: React.FC<EventFormProps> = ({
                                                 title,
                                                 description,
                                                 dateTime,
                                                 location,
                                                 categoryName,
                                                 price,
                                                 totalTickets,
                                                 status,
                                                 isVerified,
                                                 imageUrl,
                                                 setTitle,
                                                 setDescription,
                                                 setDateTime,
                                                 setLocation,
                                                 setCategoryName,
                                                 setPrice,
                                                 setTotalTickets,
                                                 setStatus,
                                                 setIsVerified,
                                                 setImageUrl,
                                                 onSubmit,
                                                 submitButtonText,
                                             }) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
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
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                    />
                    {imageUrl && (
                        <div className="mt-3">
                            <img src={imageUrl} alt="Event Preview" className="w-32 h-32 object-cover rounded-lg" />
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
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
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700">Category</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                    />
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <label className="block text-gray-700">Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Total Tickets</label>
                        <input
                            type="number"
                            value={totalTickets}
                            onChange={(e) => setTotalTickets(Number(e.target.value))}
                            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
                        required
                    >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isVerified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                        className="mr-3"
                    />
                    <span className="text-gray-700">Verified</span>
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
