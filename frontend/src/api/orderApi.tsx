// src/api/orderApi.ts
import api from './axiosInstance';

type Ticket = {
    id: number;
    ticket_code: string;
    qr_code_data: string;
    secret_code: string;
};

type Event = {
    id: number;
    title: string;
    date_time: string;
    location: string;
};

type TicketsBySessionResponse = {
    orderId: number;
    tickets: Ticket[];
    event: Event;
};

export const payForOrder = async (orderId: number): Promise<{ sessionId: string }> => {
    const res = await api.post(`/orders/pay/${orderId}`);
    return res.data.data;
};

export const getTicketsBySession = async (
    sessionId: string
): Promise<TicketsBySessionResponse> => {
    const res = await api.get(`/orders/by-session/${sessionId}`);
    return res.data.data;
};

export const createOrder = async (eventId: number, ticketCount: number) => {
    const res = await api.post('/orders', {
        eventId,
        ticketCount,
    });
    return res.data.data;
};

export const getMyOrders = async () => {
    const res = await api.get('/orders/my');
    return res.data.data;
};

export const getAvailableTickets = async (eventId: number): Promise<{
    availableTickets: number,
    ticketPrice: number
}> => {
    const res = await api.get(`/events/${eventId}/available-tickets`);
    return res.data.data;
};

