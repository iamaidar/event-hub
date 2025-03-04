import CategoryCard from "../components/HomePage/CategoryCard";
import Poster from "../components/HomePage/Poster";
import EventList from "../components/HomePage/EventList";
import axios from "axios";
import { useEffect, useState } from "react";
import { EventCardProps } from "../UI/EventCard";
import { getToken } from "../utils/tokenService";

const Home = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/events", {
        params: {
          page: 1,
          limit: 5,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        const eventsData = response.data.data.data as EventCardProps[];
        setEvents(eventsData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative px-50 py-10">
      <Poster />
      <CategoryCard />
      {loading ? (
        <p className="text-center mt-5">Загрузка...</p>
      ) : (
        <EventList
          title="Лучшие Предложения Рядом С Вами"
          initialEvents={events}
        />
      )}
    </div>
  );
};

export default Home;
