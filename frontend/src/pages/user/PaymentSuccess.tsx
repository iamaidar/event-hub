// src/pages/PaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTicketsBySession } from "../../api/orderApi.tsx";
import './PaymentSuccess.css';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [tickets, setTickets] = useState<
        { id: number; ticket_code: string; qr_code_data: string }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const sessionId = searchParams.get('session_id');
                if (!sessionId) throw new Error('session_id not found');

                const res = await getTicketsBySession(sessionId);
                setTickets(res.tickets);
            } catch (error) {
                console.error('Ошибка загрузки билетов:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [searchParams]);

    if (loading) return <p className="loading-text">Загрузка билетов...</p>;

    return (
        <div className="payment-success">
            <h2>🎉 Оплата прошла успешно!</h2>
            <h3>Ваши билеты:</h3>

            {tickets.length === 0 ? (
                <p className="no-tickets">Нет доступных билетов.</p>
            ) : (
                <div className="tickets-container">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="ticket-card">
                            <p><strong>Код билета:</strong> {ticket.ticket_code}</p>
                            <img
                                src={ticket.qr_code_data}
                                alt="QR Code"
                                width={180}
                                height={180}
                            />

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;

