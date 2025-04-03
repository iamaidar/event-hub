import api from "./axiosInstance";

type TicketInfo = {
    ticket: {
        is_used: boolean,
        order: {
            user: {
                email: string;
            };
            event: {
                title: string;
                date_time: string;
            };
        };
    }
};
type TicketApiResponse = {
    data: TicketInfo;
};
// Проверка билета по QR-коду
export const verifyTicket = async (code: string): Promise<TicketInfo> => {
    const response = await api.get<TicketApiResponse>(`/t/${code}`);
    return response.data.data;
};

// Отметить билет как использованный
export const markTicketUsed = async (code: string): Promise<void> => {
    await api.post(`/t/use/${code}`);
};
