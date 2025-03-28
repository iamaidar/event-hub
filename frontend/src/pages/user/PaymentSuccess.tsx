import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTicketsBySession } from "../../api/orderApi.tsx";
import './PaymentSuccess.css';
import { useLocation } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [tickets, setTickets] = useState<
        { id: number; ticket_code: string; qr_code_data: string }[]
    >([]);
    const [event, setEvent] = useState<{
        id: number;
        title: string;
        date_time: string;
        location: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const fromOrders = location.state?.fromOrders;


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const sessionId = searchParams.get('session_id');
                if (!sessionId) throw new Error('session_id not found');

                const res = await getTicketsBySession(sessionId);
                setTickets(res.tickets);
                setEvent(res.event);
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
            {!fromOrders && (
                <div className="success-header">
                    <h2>🎉 Оплата прошла успешно!</h2>
                </div>
            )}


            {event && (
                <div className="event-info">
                    <h3>{event.title}</h3>
                    <p>📅 {new Date(event.date_time).toLocaleString()}</p>
                    <p>📍 {event.location}</p>
                </div>
            )}

            <h3>Ваши билеты:</h3>

            {tickets.length === 0 ? (
                <p className="no-tickets">Нет доступных билетов.</p>
            ) : (
                <div className="tickets-container">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="ticket-card">
                            <img
                                src={ticket.qr_code_data}
                                alt="QR Code"
                                width={180}
                                height={180}
                            />
                            <p><strong>Код билета:</strong> {ticket.ticket_code}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;

