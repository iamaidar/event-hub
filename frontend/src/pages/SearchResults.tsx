import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import EventList from "../components/HomePage/EventList";
import { EventCardProps } from "../UI/EventCard";
import { getAccessToken } from "../utils/tokenService";

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
            Authorization: `Bearer ${getAccessToken()}`,
          },
        })
        .then((response) => {
          setEvents(response.data.data.data as EventCardProps[]);
        })
        .catch((error) => {
          console.error("Error loading events:", error);
        })
        .finally(() => setLoading(false));
  }, [searchParams]);

  return (
      <div className="mx-auto max-w-4xl">
        {loading ? (
            <p className="text-center mt-5">Loading...</p>
        ) : (
            <EventList title="Found Events" initialEvents={events} />
        )}
      </div>
  );
};

export default SearchResults;
