import EventCard, { EventCardProps } from "../../UI/EventCard";
import axios from "axios";
import { getToken } from "../../utils/tokenService";
import { useEffect, useState } from "react";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);

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
      })
      .catch((error) => {
        console.log(`Ошибка: ${error}`);
      });
  }, []);

  return (
    <section className="mt-8 p-4">
      <h3 className="text-2xl font-bold text-center">
        Лучшие Предложения Рядом С Вами
      </h3>
      <div className="mt-4">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </section>
  );
};

export default EventList;
