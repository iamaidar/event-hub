import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAvailableTickets, createOrder } from "../../api/orderApi";
import { addToCalendar, EventType, fetchEventById } from "../../api/eventApi";
import { fetchPaginatedReviews, ReviewType } from "../../api/reviewApi";
import Button from "../../UI/Button";
import Modal from "../../components/Modal";
import ReviewsSlider from "../../components/user/ReviewsSlider.tsx";
import ReviewsSummary from "../../components/user/ReviewsSummary.tsx";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import SocialIntegration from "../../components/user/SocialIntegration.tsx";
import { isUserBoughtTicket } from "../../api/eventGroupApi.tsx";
import { useAuth } from "../../hooks/useAuth.ts";
import { getCurrentUser, User } from "../../api/userApi.tsx";

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useAuth();
  const isMounted = useRef(false);

  const [eventState, setEventState] = useState({
    event: null as EventType | null,
    availableTickets: null as number | null,
    ticketPrice: null as number | null,
    ticketCount: 1,
    modalOpen: false,
    loading: true,
  });

  const [reviewsState, setReviewsState] = useState({
    reviews: [] as ReviewType[],
    reviewPage: 1,
    totalPages: 0,
    isLoading: false,
  });

  const [isTicketBoughtAndIsSocial, setIsTicketBoughtAndIsSocial] =
    useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isTicketBought, setIsTicketBought] = useState<boolean>(false);

  const fetchEventData = useCallback(async () => {
    try {
      const [eventData, ticketData] = await Promise.all([
        fetchEventById(Number(id)),
        getAvailableTickets(Number(id)),
      ]);
      setEventState((prev) => ({
        ...prev,
        event: eventData,
        availableTickets: ticketData.availableTickets,
        ticketPrice: ticketData.ticketPrice,
        loading: false,
      }));
    } catch (err) {
      console.error("Error loading event data:", err);
      setEventState((prev) => ({ ...prev, loading: false }));
    }
  }, [id]);

  const fetchReviewsData = useCallback(
    async (page: number, reset: boolean = false) => {
      setReviewsState((prev) => ({ ...prev, isLoading: true }));
      try {
        const reviewData = await fetchPaginatedReviews(page, 4, Number(id));
        setReviewsState((prev) => ({
          ...prev,
          reviews: reset
            ? reviewData.data || []
            : prev.reviews.concat(reviewData.data || []),
          totalPages: reviewData.totalPages || 0,
          reviewPage: page,
          isLoading: false,
        }));
      } catch (err) {
        console.error("Error loading reviews:", err);
        setReviewsState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [id],
  );

  const handleReviewAdded = useCallback(() => {
    setReviewsState((prev) => ({ ...prev, reviews: [], reviewPage: 1 }));
    fetchReviewsData(1, true);
  }, [fetchReviewsData]);

  useEffect(() => {
    if (authUser.user && id && !isNaN(Number(id))) {
      getCurrentUser().then((data) => {
        setUser(data);
      });

      isUserBoughtTicket(id)
        .then((data) => {
          setIsTicketBought(data);
          setIsTicketBoughtAndIsSocial(data && user?.is_social);
        })
        .catch((error) => {
          console.error(`Error while getting data from api: ${error}`);
        });
    }
  }, [id, authUser.user]);

  useEffect(() => {
    if (!isMounted.current) {
      fetchEventData();
      fetchReviewsData(1);
      isMounted.current = true;
    }
  }, [fetchEventData, fetchReviewsData]);

  const handleBookClick = () => {
    if (!authUser.user) {
      navigate("/login");
    } else {
      setEventState((prev) => ({ ...prev, ticketCount: 1, modalOpen: true }));
    }
  };

  const handleAddToCalendar = async () => {
    if (!authUser.user) {
      navigate("/login"); // Если пользователь не авторизован, перенаправляем на логин
      return;
    }

    try {
      const response = await addToCalendar(Number(id)); // Вызываем addToCalendar
      alert("Событие успешно добавлено в Google Calendar!");
      console.log("Создано событие:", response);
    } catch (error: any) {
      console.error("Ошибка при добавлении в календарь:", error);
      alert(
        error.response?.data?.message ||
          "Не удалось добавить событие в календарь. Убедитесь, что вы авторизованы через Google.",
      );
    }
  };

  const handleOrderSubmit = async () => {
    if (eventState.ticketCount > (eventState.availableTickets || 0)) {
      alert("Not enough tickets available.");
      return;
    }
    try {
      await createOrder(Number(id), eventState.ticketCount);
      setEventState((prev) => ({ ...prev, modalOpen: false }));
      navigate("/user/orders/my");
    } catch (err) {
      console.error("Error placing order:", err);
    }
  };

  const handleReachEnd = useCallback(() => {
    if (
      reviewsState.reviewPage < reviewsState.totalPages &&
      !reviewsState.isLoading
    ) {
      console.log("Reached end, loading page:", reviewsState.reviewPage + 1);
      fetchReviewsData(reviewsState.reviewPage + 1);
    }
  }, [
    reviewsState.reviewPage,
    reviewsState.totalPages,
    reviewsState.isLoading,
    fetchReviewsData,
  ]);

  const formattedDate = eventState.event
    ? new Date(eventState.event.date_time).toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  const totalPrice = eventState.ticketPrice
    ? eventState.ticketPrice * eventState.ticketCount
    : 0;

  if (eventState.loading) return <p className="text-center">Loading...</p>;
  if (!eventState.event)
    return <p className="text-center text-red-500">Event not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-gray-100 rounded-lg">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={eventState.event.image_base64}
          alt={eventState.event.title}
          loading="lazy"
          className="w-full md:w-1/2 rounded-lg shadow-md object-cover"
        />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">
            {eventState.event.title}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <p className="text-gray-500 text-lg">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <p className="text-gray-700 font-semibold text-lg">
              {eventState.event.location}
            </p>
          </div>
          {eventState.ticketPrice !== null && (
            <div className="flex items-center gap-2 mt-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <p className="text-xl font-bold text-purple-600">
                {eventState.ticketPrice}
              </p>
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <Button
              text="Buy Now"
              onClick={handleBookClick}
              variant="solid"
              className="flex-1"
            />
            {isTicketBought && (
              <Button
                text="Add to Calendar"
                onClick={handleAddToCalendar}
                variant="outline"
                className="flex-1"
              />
            )}
          </div>
          <ReviewsSummary
            event_id={Number(id)}
            reviews={reviewsState.reviews}
            onReviewAdded={handleReviewAdded}
          />
        </div>
      </div>

      <h2 className="mt-8 text-2xl text-center font-bold text-purple-500">
        Description
      </h2>
      <p className="text-gray-700 mt-2 leading-relaxed">
        {eventState.event.description}
      </p>

      <h2 className="mt-8 text-2xl text-center font-bold text-purple-500">
        Reviews
      </h2>
      <ReviewsSlider
        reviews={reviewsState.reviews}
        onReachEnd={handleReachEnd}
      />

      {isTicketBoughtAndIsSocial && (
        <div className="mt-8">
          <h2 className="mt-8 text-2xl text-center font-bold text-purple-500">
            Social Integration
          </h2>
          <SocialIntegration eventId={Number(id)} />
        </div>
      )}

      <Modal
        isOpen={eventState.modalOpen}
        onClose={() => setEventState((prev) => ({ ...prev, modalOpen: false }))}
      >
        <h2 className="text-xl font-bold mb-4">Order Tickets</h2>
        {eventState.availableTickets !== null ? (
          <>
            <p className="mb-2 text-sm text-gray-700">
              Available Tickets: {eventState.availableTickets}
            </p>
            <input
              type="number"
              value={eventState.ticketCount}
              onChange={(e) =>
                setEventState((prev) => ({
                  ...prev,
                  ticketCount: Math.max(
                    1,
                    Math.min(
                      eventState.availableTickets ?? 1,
                      Number(e.target.value),
                    ),
                  ),
                }))
              }
              min={1}
              max={eventState.availableTickets ?? 1}
              className="border px-2 py-1 rounded w-full mb-4"
            />
            <p className="mb-4 text-sm text-gray-700">
              Total Price: {totalPrice} KGS
            </p>
            <Button
              text="Confirm Order"
              onClick={handleOrderSubmit}
              variant="solid"
            />
          </>
        ) : (
          <p>Loading ticket data...</p>
        )}
      </Modal>
    </div>
  );
};

export default ViewDetails;
