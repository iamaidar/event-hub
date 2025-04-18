import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { payForOrder, getMyOrders, deleteOrder } from '../../api/orderApi'; // Предположим, что у вас есть API для удаления заказа
import { Trash } from 'lucide-react'; // Импортируем иконку корзины для удаления
import { getAccessToken } from "../../utils/tokenService";
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
                // Фильтруем заказы, чтобы не показывать статус "confirmed"
                const filteredOrders = data.filter((order: Order) => order.status !== 'confirmed');
                setOrders(filteredOrders);
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

    const handleDelete = async (orderId: number) => {
        const authToken = getAccessToken(); // Пример получения токена из localStorage

        if (!authToken) {
            console.error('No auth token found');
            return;
        }

        try {
            const result = await deleteOrder(orderId, authToken);
            console.log('Order deleted:', result);

            // Удаляем заказ из локального состояния
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('Unknown error', error);
            }
        }
    };

    return (
        <div className="pt-10">
            <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
                <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

                {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

                {orders.length === 0 ? (
                    <p className="text-gray-500">No orders found.</p>
                ) : (
                    <ul className="space-y-4">
                        {orders.map((order) => (
                            <li
                                key={order.id}
                                className="border-b py-4 flex justify-between items-center"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-lg">Order #{order.id}</p>
                                    <p className="text-sm text-gray-600">Event: {order.event?.title}</p>
                                    <p className="text-sm text-gray-500">Amount: ${Number(order.total_amount).toFixed(2)}</p>
                                    <p className="text-sm text-gray-400">Tickets: {order.ticket_count} </p>
                                    <p className={`text-sm ${statusLabel[order.status].color}`}>
                                        {statusLabel[order.status].text}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center">
                                    {/* Иконка удаления */}
                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <Trash size={18} />
                                    </button>

                                    {/* Кнопка оплаты */}
                                    {order.status === 'pending' ? (
                                        <button
                                            onClick={() => handlePay(order.id)}
                                            disabled={loadingId === order.id}
                                            className="mt-2 bg-indigo-600 text-white text-sm py-1 px-4 rounded hover:bg-indigo-700"
                                        >
                                            {loadingId === order.id ? 'Redirecting...' : '💳 Pay Now'}
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Payment not available</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrderPage;
