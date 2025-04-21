import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from "../../../api/orderApi.tsx";

const MyTicketsPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                const confirmedOrders = data.filter((order: any) => order.status === 'confirmed');
                setOrders(confirmedOrders);
            } catch (err) {
                console.error('Error loading orders:', err);
                setError('Failed to load your orders.');
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">My Tickets</h1>

            {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

            {orders.length === 0 ? (
                <p className="text-gray-500">No confirmed tickets found.</p>
            ) : (
                <ul className="space-y-6">
                    {orders.map((order) => (
                        <li key={order.id} className="border-b pb-6">
                            <div className="mb-2">
                                <p className="text-lg font-semibold">Order #{order.id}</p>
                                <p className="text-gray-700">Event: {order.event?.title}</p>
                                <p className="text-gray-500">Total: ${Number(order.total_amount).toFixed(2)}</p>
                                <p className="text-gray-500">Tickets: {order.ticket_count}</p>
                                <p className="text-sm text-gray-400">
                                    Date: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-green-600 text-sm font-medium">Status: Confirmed</p>

                                {order.stripe_payment_id && (
                                    <button
                                        onClick={() => navigate(`/user/payment-success?session_id=${order.stripe_payment_id}`, {
                                            state: { fromOrders: true }
                                        })}
                                        className="mt-3 inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-4 rounded text-sm"
                                    >
                                        🎟️ View Ticket
                                    </button>
                                )}
                            </div>

                            {order.tickets && order.tickets.length > 0 ? (
                                <div className="mt-2">
                                    <h2 className="text-base font-semibold text-gray-800 mb-2">Tickets</h2>
                                    <ul className="space-y-2">
                                        {order.tickets.map((ticket: any) => (
                                            <li key={ticket.id} className="bg-gray-100 p-3 rounded-md">
                                                <p className="font-medium text-sm">Ticket #{ticket.id}</p>
                                                <p className="text-gray-700 text-sm">Seat: {ticket.seat}</p>
                                                <p className="text-gray-500 text-sm">Price: ${ticket.price}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-2">No tickets available for this order.</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyTicketsPage;
