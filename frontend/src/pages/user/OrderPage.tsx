// src/pages/user/OrderPage.tsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { payForOrder, getMyOrders } from '../../api/orderApi';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type Order = {
    id: number;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
    stripe_payment_id?: string;
    createdAt: string;
    ticket_count: number;
    event: {
        title: string;
    };
};

const statusLabel = {
    pending: { text: 'Pending', color: 'text-yellow-600' },
    confirmed: { text: 'Confirmed', color: 'text-green-600' },
    cancelled: { text: 'Cancelled', color: 'text-red-600' },
    refunded: { text: 'Refunded', color: 'text-blue-600' },
};

const OrderPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                setOrders(data);
            } catch (err) {
                console.error('Error loading orders:', err);
                setError('Failed to load your orders.');
            }
        };
        fetchOrders();
    }, []);

    const handlePay = async (orderId: number) => {
        try {
            setLoadingId(orderId);
            setError(null);

            const { sessionId } = await payForOrder(orderId);
            const stripe = await stripePromise;
            await stripe?.redirectToCheckout({ sessionId });
        } catch (err) {
            console.error('Payment error:', err);
            setError('An error occurred while initializing payment.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="pt-10">
            <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-6">My Orders</h1>

                {error && (
                    <div className="mb-4 text-red-600 font-medium">{error}</div>
                )}

                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <ul className="space-y-4">
                        {orders.map((order) => (
                            <li key={order.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">Order #{order.id}</p>
                                    <p>Event: {order.event?.title}</p>
                                    <p>Total Amount: ${Number(order.total_amount).toFixed(2)}</p>
                                    <p>Tickets: {order.ticket_count}</p>
                                    <p className="text-sm text-gray-500">
                                        Date: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className={`font-medium ${statusLabel[order.status].color}`}>
                                        Status: {statusLabel[order.status].text}
                                    </p>
                                </div>

                                {order.status === 'pending' ? (
                                    <button
                                        onClick={() => handlePay(order.id)}
                                        disabled={loadingId === order.id}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                                    >
                                        {loadingId === order.id ? 'Redirecting...' : '💳 Pay Now'}
                                    </button>
                                ) : (
                                    <span className="text-gray-400">Payment not available</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrderPage;


