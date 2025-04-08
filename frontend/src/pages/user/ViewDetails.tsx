import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAvailableTickets, createOrder } from "../../api/orderApi";
import { EventType, fetchEventById } from "../../api/eventApi";
import { fetchPaginatedReviews, ReviewType } from "../../api/reviewApi";
import Button from "../../UI/Button";
import { useAuth } from "../../hooks/useAuth";
import Modal from "../../components/Modal";
import ReviewsSlider from "../../components/homepage/ReviewsSlider";
import ReviewsSummary from "../../components/homepage/ReviewsSummary.tsx";
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const ViewDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [state, setState] = useState({
        event: null as EventType | null,
        availableTickets: null as number | null,
        ticketPrice: null as number | null,
        ticketCount: 1,
        modalOpen: false,
        loading: true,
        reviews: [] as ReviewType[],
        page: 1,
        hasMore: true
    });

    const fetchData = useCallback(async () => {
        try {
            const [eventData, ticketData, reviewData] = await Promise.all([
                fetchEventById(Number(id)),
                getAvailableTickets(Number(id)),
                fetchPaginatedReviews(state.page, 100)
            ]);

            setState(prevState => ({
                ...prevState,
                event: eventData,
                availableTickets: ticketData.availableTickets,
                ticketPrice: ticketData.ticketPrice,
                reviews: [...prevState.reviews, ...reviewData.data.filter(review => review.event.id === Number(id))],
                hasMore: reviewData.data.length >= 10,
                loading: false
            }));
        } catch (err) {
            console.error("Error loading data:", err);
            setState(prevState => ({ ...prevState, loading: false }));
        }
    }, [id, state.page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBookClick = () => {
        if (!user) {
            navigate("/login");
        } else {
            setState(prevState => ({ ...prevState, ticketCount: 1, modalOpen: true }));
        }
    };

    const handleOrderSubmit = async () => {
        if (state.ticketCount > (state.availableTickets || 0)) {
            alert("Not enough tickets available.");
            return;
        }
        try {
            await createOrder(Number(id), state.ticketCount);
            setState(prevState => ({ ...prevState, modalOpen: false }));
            navigate("/user/orders/my");
        } catch (err) {
            console.error("Error placing order:", err);
        }
    };

    if (state.loading) return <p className="text-center">Loading...</p>;
    if (!state.event) return <p className="text-center text-red-500">Event not found</p>;

    const totalPrice = state.ticketPrice ? state.ticketPrice * state.ticketCount : 0;
    const formattedDate = new Date(state.event.date_time).toLocaleString('en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false
    });

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 bg-gray-100 rounded-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <img src={state.event.image_base64} alt={state.event.title} loading="lazy" className="w-full md:w-1/2 rounded-lg shadow-md object-cover" />
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">{state.event.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <p className="text-gray-500 text-lg">{formattedDate}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <p className="text-gray-700 font-semibold text-lg">{state.event.location}</p>
                    </div>
                    {state.ticketPrice !== null && (
                        <div className="flex items-center gap-2 mt-2">
                            <DollarSign className="h-5 w-5 text-gray-500" />
                            <p className="text-xl font-bold text-purple-600">{state.ticketPrice}</p>
                        </div>
                    )}
                    <Button text="Buy Now" onClick={handleBookClick} variant="solid" className="mt-4" />
                    <ReviewsSummary reviews={state.reviews}  />

                </div>
            </div>
            <h2 className="mt-8 text-2xl text-center font-bold text-purple-500">Description</h2>
            <p className="text-gray-700 mt-2 leading-relaxed">{state.event.description}</p>
            <h2 className="mt-8 text-2xl text-center font-bold text-purple-500">Reviews</h2>
            <ReviewsSlider reviews={state.reviews} />
            {state.hasMore && (
                <button
                    onClick={() => setState(prevState => ({ ...prevState, page: prevState.page + 1 }))}
                    className="block mx-auto mt-4 px-6 py-2 bg-gray-100 hover:bg-purple-200 text-gray-800 rounded-lg transition-colors duration-200 border border-gray-300"
                >
                    Show More Reviews
                </button>
            )}
            <Modal isOpen={state.modalOpen} onClose={() => setState(prevState => ({ ...prevState, modalOpen: false }))}>
                <h2 className="text-xl font-bold mb-4">Order Tickets</h2>
                {state.availableTickets !== null ? (
                    <>
                        <p className="mb-2 text-sm text-gray-700">Available Tickets: {state.availableTickets}</p>
                        <input
                            type="number" value={state.ticketCount}
                            onChange={(e) => setState(prevState => ({ ...prevState, ticketCount: Math.max(1, Math.min(state.availableTickets ?? 1, Number(e.target.value))) }))}
                            min={1} max={state.availableTickets ?? 1}
                            className="border px-2 py-1 rounded w-full mb-4"
                        />
                        <p className="mb-4 text-sm text-gray-700">Total Price: {totalPrice} KGS</p>
                        <Button text="Confirm Order" onClick={handleOrderSubmit} variant="solid" />
                    </>
                ) : (
                    <p>Loading ticket data...</p>
                )}
            </Modal>
        </div>
    );
};
export default ViewDetails;
