import api from "./axiosInstance";

type TicketInfo = {
    name: string;
    event: string;
    used: boolean;
};

// Проверка билета по QR-коду
export const verifyTicket = async (code: string): Promise<TicketInfo> => {
    const response = await api.get<TicketInfo>(`/t/${code}`);
    console.log(response);
    return response.data;
};

// Отметить билет как использованный
export const markTicketUsed = async (code: string): Promise<void> => {
    await api.post(`/api/tickets/use/${code}`);
};
