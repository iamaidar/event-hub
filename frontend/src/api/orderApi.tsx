// src/api/orderApi.ts
import api from './axiosInstance';

export const payForOrder = async (orderId: number): Promise<{ sessionId: string }> => {
    const res = await api.post(`/orders/pay/${orderId}`);
    console.log(res);
    return res.data.data;
};

export const getTicketsBySession = async (
    sessionId: string
): Promise<{ tickets: { id: number; ticket_code: string; qr_code_data: string }[] }> => {
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

export const getAvailableTickets = async (eventId: number): Promise<{ availableTickets: number,ticketPrice:number }> => {
    const res = await api.get(`/events/${eventId}/available-tickets`);
    return res.data.data;
};

