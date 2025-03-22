// src/pages/user/OrderPage.tsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import { payForOrder } from '../../api/orderApi';

const stripePromise = loadStripe('pk_test_51R5XpnDG9SLxUqscesPeBWiaD9UI1PtzC8AaOdrMPxGFozfKZKdQ2BLX0iJshLtAWLEehI4LOMBBnhnGmpQ1tmL300sYxWR2NN');

const OrderPage: React.FC = () => {
    const { id } = useParams();
    const orderId = Number(id);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePay = async () => {
        try {
            setLoading(true);
            setError(null);

            const { sessionId } = await payForOrder(orderId);
            const stripe = await stripePromise;
            await stripe?.redirectToCheckout({ sessionId });
        } catch (err: any) {
            console.error('Ошибка при оплате:', err);
            setError('Произошла ошибка при инициализации оплаты.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Оплата заказа #{orderId}</h1>

            <p className="mb-6 text-gray-700">
                Пожалуйста, нажмите на кнопку ниже для перехода к безопасной оплате через Stripe.
            </p>

            {error && (
                <div className="mb-4 text-red-600 font-medium">{error}</div>
            )}

            <button
                onClick={handlePay}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
            >
                {loading ? 'Ожидание Stripe...' : '💳 Оплатить'}
            </button>
        </div>
    );
};

export default OrderPage;


