import React from "react";
import { EventStatus, EventStatusList } from "../../../api/eventApi";

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
  status: EventStatus;
  isVerified: boolean;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setDateTime: (value: string) => void;
  setLocation: (value: string) => void;
  setPrice: (value: number) => void;
  setTotalTickets: (value: number) => void;
  setStatus:React.Dispatch<React.SetStateAction<EventStatus>>;
  setIsVerified: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
  categories: Category[];
  selectedCategoryId: number | null;
  setSelectedCategoryId: (value: number | null) => void;
  imageBase64: string | null;
  setImageBase64: (value: string | null) => void;
}

const EventForm: React.FC<EventFormProps> = ({
  title,
  description,
  dateTime,
  location,
  price,
  totalTickets,
  status,
  isVerified,
  setTitle,
  setDescription,
  setDateTime,
  setLocation,
  setPrice,
  setTotalTickets,
  setStatus,
  setIsVerified,
  onSubmit,
  submitButtonText,
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
  imageBase64,
  setImageBase64,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("🟢 Загруженный image_base64:", reader.result);
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white text-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Event Management
      </h2>
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
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
          />
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
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
          <select
            value={selectedCategoryId ?? ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              console.log("🟡 Selected category:", value);
              setSelectedCategoryId(value);
            }}
            className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
          >
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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
              onChange={(e) => setPrice(Number(e.target.value) || 0)} // 🛠 Фиксим, чтобы было числом
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
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="w-full border px-4 py-3 rounded-full bg-gray-100 border-gray-300 focus:ring focus:ring-blue-400"
              required
          >
            {EventStatusList.map((statusValue) => (
                <option key={statusValue} value={statusValue}>
                  {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)} // 🛠 Передаем true/false
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
