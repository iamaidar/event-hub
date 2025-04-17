import React, { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { getTicketsBySession } from "../../api/orderApi.tsx";
import './PaymentSuccess.css';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [tickets, setTickets] = useState<
        { id: number; ticket_code: string; qr_code_data: string; secret_code: string }[]
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
                if (!sessionId) throw new Error('Session ID not found');

                const res = await getTicketsBySession(sessionId);
                console.log(res);
                setTickets(res.tickets);
                setEvent(res.event);
            } catch (error) {
                console.error('Failed to load tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [searchParams]);

    if (loading) return <p className="loading-text">Loading your tickets...</p>;

    return (
        <div className="payment-success">
            {!fromOrders && (
                <div className="success-header">
                    <h2>🎉 Payment Successful!</h2>
                </div>
            )}

            {event && (
                <div className="event-info">
                    <h3>{event.title}</h3>
                    <p>📅 {new Date(event.date_time).toLocaleString()}</p>
                    <p>📍 {event.location}</p>
                </div>
            )}

            <h3>Your Tickets:</h3>

            {tickets.length === 0 ? (
                <p className="no-tickets">No tickets available.</p>
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
                            <p><strong>Ticket Code:</strong> {ticket.ticket_code}</p>
                            <p className="secret-code">
                                <strong>Secret Code:</strong> {ticket.secret_code}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;

