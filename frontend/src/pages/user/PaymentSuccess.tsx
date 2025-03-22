// src/pages/PaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import {getTicketsBySession} from "../../api/orderApi.tsx";

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

    if (loading) return <p>Загрузка билетов...</p>;

    return (
        <div className="payment-success">
            <h2>🎉 Оплата прошла успешно!</h2>
            <h3>Ваши билеты:</h3>

            {tickets.length === 0 ? (
                <p>Нет доступных билетов.</p>
            ) : (
                tickets.map((ticket) => (
                    <div key={ticket.id} style={{ margin: '20px 0' }}>
                        <p><strong>Код билета:</strong> {ticket.ticket_code}</p>
                        <QRCode value={ticket.qr_code_data} />
                    </div>
                ))
            )}
        </div>
    );
};

export default PaymentSuccess;
