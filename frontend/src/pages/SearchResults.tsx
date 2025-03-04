import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import EventList from "../components/HomePage/EventList";
import { EventCardProps } from "../UI/EventCard";
import { getToken } from "../utils/tokenService";

const SearchResults = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:3000/events/filter", {
        params: {
          location: searchParams.get("location"),
          title: searchParams.get("query"),
          dateFrom: searchParams.get("fromDate"),
          dateTo: searchParams.get("toDate"),
          page: searchParams.get("page") || 1,
          limit: searchParams.get("limit") || 10,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setEvents(response.data.data.data as EventCardProps[]);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке событий:", error);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);
  return (
    <div className="mx-auto max-w-4xl">
      {loading ? (
        <p className="text-center mt-5">Загрузка...</p>
      ) : (
        <EventList title="Найденные мероприятия" initialEvents={events} />
      )}
    </div>
  );
};

export default SearchResults;
