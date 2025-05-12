import { useEffect, useState } from "react";
import axios from "axios";
import EventList from "../components/homepage/EventList";
import { EventCardProps } from "../UI/EventCard";
import { getAccessToken } from "../utils/tokenService";
import { useSearchParams } from "react-router-dom";

const SearchResults = () => {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/events/filter`,
          {
            params: {
              location: searchParams.get("location"),
              title: searchParams.get("query"),
              dateFrom: searchParams.get("fromDate"),
              dateTo: searchParams.get("toDate"),
              categoryId: searchParams.get("categoryId"),
              page: searchParams.get("page") || 1,
              limit: searchParams.get("limit") || 10,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAccessToken()}`,
            },
          },
        );

        const eventsData = response.data.data;
        setEvents(eventsData.data as EventCardProps[]);
        setPage(eventsData.page);
        setTotalPages(eventsData.totalPages);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const updatedParams = new URLSearchParams(searchParams.toString());
    updatedParams.set("page", newPage.toString());
    setSearchParams(updatedParams); // обновляем параметры поиска в URL
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      {loading ? (
        <p className="text-center mt-5">Loading...</p>
      ) : (
        <>
          <EventList title="Found Events" initialEvents={events} />

          {/* Пагинация */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-full border bg-white text-purple-600 hover:bg-purple-100 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-black font-bold">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-full border bg-white text-purple-600 hover:bg-purple-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
