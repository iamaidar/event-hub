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
  image_base64: string;
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
              src={image_base64}
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
                  })}
                </p>
            )}
            {availableTickets !== null && (
                <p className="text-sm text-gray-700">
                  Tickets Available: {availableTickets}
                </p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <Button text="View Details" to={`/user/details/${id}`} variant="outline" />
            <Button variant="solid" text="Book Now" onClick={handleBookClick} />
          </div>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Book Tickets</h2>
          {availableTickets !== null ? (
              <>
                <p className="mb-2 text-sm text-gray-700">
                  Tickets Available: {availableTickets}
                </p>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Number of Tickets:
                </label>
                <input
                    type="number"
                    value={ticketCount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value > (availableTickets ?? 1)) {
                        setTicketCount(availableTickets!);
                      } else if (value < 1) {
                        setTicketCount(1);
                      } else {
                        setTicketCount(value);
                      }
                    }}
                    min={1}
                    max={availableTickets ?? 1}
                    className="border px-2 py-1 rounded w-full mb-4"
                />
                <p className="mb-4 text-sm text-gray-700">
                  Total Price: {totalPrice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
                </p>
                <Button text="Submit Order" onClick={handleOrderSubmit} variant="solid" />
              </>
          ) : (
              <p>Loading ticket availability...</p>
          )}
        </Modal>
      </div>
  );
};

export default EventCard;