import { useEffect, useState } from "react";
import { Search, Calendar, MapPin, List } from "lucide-react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAccessToken } from "../../utils/tokenService";
import { useNavigate } from "react-router-dom";

export default function Filter() {
  const [eventQuery, setEventQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка локаций
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/events/locations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      .then((response) => {
        const locationsData = response.data.data as string[];
        setLocations(locationsData);
      });

    // Загрузка категорий
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/categories/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
      .then((response) => {
        const categoriesData = response.data.data as {
          id: number;
          name: string;
        }[];
        setCategories(categoriesData);
      });
  }, []);

  const handleSubmit = () => {
    const queryParams = new URLSearchParams();

    if (eventQuery) queryParams.append("query", eventQuery);
    if (selectedCity) queryParams.append("location", selectedCity);
    if (selectedCategoryId)
      queryParams.append("categoryId", selectedCategoryId);
    if (fromDate)
      queryParams.append("fromDate", fromDate.toISOString().split("T")[0]);
    if (toDate)
      queryParams.append("toDate", toDate.toISOString().split("T")[0]);

    navigate(`/events?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-[#04092C] p-4 rounded-lg justify-between md:flex-row flex-col">
      {/* Поиск по событию */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-purple-500" size={20} />
        <input
          type="text"
          placeholder="Search by Event, Artist, Venue..."
          value={eventQuery}
          onChange={(e) => setEventQuery(e.target.value)}
          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Выбор города */}
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 text-purple-500" size={20} />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-40 pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
        >
          <option value="" className="text-black">
            City
          </option>
          {locations.map((value, index) => (
            <option key={index} value={value} className="text-black">
              {value}
            </option>
          ))}
        </select>
      </div>

      {/* Выбор категории */}
      <div className="relative">
        <List className="absolute left-3 top-2.5 text-purple-500" size={20} />
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-40 pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
        >
          <option value="" className="text-black">
            Category
          </option>
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id.toString()}
              className="text-black"
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Дата "от" */}
      <div className="relative">
        <Calendar
          className="absolute left-3 top-2.5 text-purple-500"
          size={20}
        />
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          dateFormat="dd.MM.yyyy"
          placeholderText="From"
          className="w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Дата "до" */}
      <div className="relative">
        <Calendar
          className="absolute left-3 top-2.5 text-purple-500"
          size={20}
        />
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          dateFormat="dd.MM.yyyy"
          placeholderText="To"
          className="w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Кнопка поиска */}
      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
      >
        Search
      </button>
    </div>
  );
}
