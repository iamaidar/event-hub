import CategoryCard from "../components/homepage/CategoryCard";
import Poster from "../components/homepage/Poster";
import EventList from "../components/homepage/EventList";
import axios from "axios";
import { useEffect, useState } from "react";
import { EventCardProps } from "../UI/EventCard";
import { getAccessToken } from "../utils/tokenService";

const Home = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/events`, {
        params: {
          page: 1,
          limit: 5,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
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
        <p className="text-center mt-5">Downloading...</p>
      ) : (
        <EventList title="Best Deals Near You" initialEvents={events} />
      )}
    </div>
  );
};

export default Home;
