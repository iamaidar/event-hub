import React, { useState, useEffect } from "react";
import Button from "./Button";
import { createOrder, getAvailableTickets } from "../api/orderApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Modal from "../components/Modal";

export interface EventCardProps {
  id: number;
  date_time: string;
  title: string;
  location: string;
  image_base64?: string | null;
}

const EventCard: React.FC<EventCardProps> = ({
                                               id,
                                               date_time,
                                               title,
                                               location,
                                               image_base64,
                                             }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [availableTickets, setAvailableTickets] = useState<number | null>(null);
  const [ticketPrice, setTicketPrice] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const date = new Date(date_time);
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const { availableTickets, ticketPrice } = await getAvailableTickets(id);
        setAvailableTickets(availableTickets);
        setTicketPrice(ticketPrice);
      } catch (err) {
        console.error("Failed to fetch ticket data:", err);
      }
    };
    fetchTicketData();
  }, [id]);

  const handleBookClick = () => {
    console.log(user);
    if (!user) {
      navigate("/login");
    } else {
      setTicketCount(1);
      setModalOpen(true);
    }
  };

  const handleOrderSubmit = async () => {
    if (ticketCount > (availableTickets || 0)) {
      alert("You can't order more tickets than are available.");
      return;
    }
    try {
      await createOrder(id, ticketCount);
      setModalOpen(false);
      navigate("/user/orders/my");
    } catch (err) {
      console.error("Order creation failed:", err);
    }
  };

  const totalPrice = ticketPrice ? ticketPrice * ticketCount : 0;

  return (
      <div className="flex flex-col bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <img
              src={image_base64 || "https://via.placeholder.com/50"}
              alt={title}
              className="w-20 h-20 rounded-md mr-4"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-500">
              {formattedDate} • {formattedTime}
            </p>
            <h4 className="font-bold text-lg">{title}</h4>
            <p className="text-gray-600">{location}</p>
            {ticketPrice !== null && (
                <p className="text-sm text-gray-700 mt-1">
                  Ticket Price:{" "}
                  {ticketPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}$
                </p>
            )}
            {availableTickets !== null && (
                <p className="text-sm text-gray-700">
                  Tickets Available: {availableTickets}
                </p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <Button text="View Details" to={`/details/${id}`} variant="outline" />
            <Button variant="solid" text="Book Now" onClick={handleBookClick} />
          </div>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="max-w-md w-full mx-auto p-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Book Tickets</h2>

            {availableTickets !== null ? (
                <div className="space-y-4">
                  {/* Available tickets */}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Tickets Available:</span>
                    <span className="font-medium">{availableTickets}</span>
                  </div>

                  {/* Ticket counter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Tickets:
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                          onClick={() => setTicketCount(prev => Math.max(1, prev - 1))}
                          className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          disabled={ticketCount <= 1}
                      >
                        -
                      </button>
                      <input
                          type="number"
                          value={ticketCount}
                          onChange={(e) => {
                            const value = Math.min(
                                Math.max(1, Number(e.target.value)),
                                availableTickets
                            );
                            setTicketCount(value);
                          }}
                          min={1}
                          max={availableTickets}
                          className="flex-1 text-center border-0 focus:ring-0"
                      />
                      <button
                          onClick={() => setTicketCount(prev => Math.min(availableTickets, prev + 1))}
                          className="px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          disabled={ticketCount >= availableTickets}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total price */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Total Price:</span>
                      <span className="font-medium">
              {totalPrice.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
                    </div>
                  </div>

                  <Button text="Submit Order" onClick={handleOrderSubmit} variant="solid" />

                </div>
            ) : (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}
          </div>
        </Modal>
      </div>
  );
};

export default EventCard;