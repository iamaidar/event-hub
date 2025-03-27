// src/services/ticketSales.ts
import api from "./axiosInstance";// Импортируем api

export const TicketSales = [
    { month: "Jan", ticketsSold: 120 },
    { month: "Feb", ticketsSold: 230 },
    { month: "Mar", ticketsSold: 340 },
    { month: "Apr", ticketsSold: 290 },
    { month: "May", ticketsSold: 420 },
    { month: "Jun", ticketsSold: 310 },
    { month: "Jul", ticketsSold: 275 },
    { month: "Aug", ticketsSold: 365 },
    { month: "Sep", ticketsSold: 400 },
    { month: "Oct", ticketsSold: 220 },
    { month: "Nov", ticketsSold: 180 },
    { month: "Dec", ticketsSold: 250 },
];

export const fetchTicketSales = async (): Promise<{ month: string; ticketsSold: number }[]> => {
    if (process.env.NODE_ENV === 'development') {
        return TicketSales;  // Возвращаем мок-данные
    }

    try {
        const response = await api.get<{ month: string; ticketsSold: number }[]>("/stat/ticket-sales");
        return response.data;  // Получаем данные с сервера
    } catch (error) {
        console.error("Ошибка загрузки данных о продажах билетов:", error);
        throw error;  // Бросаем ошибку, если что-то пошло не так
    }
};
