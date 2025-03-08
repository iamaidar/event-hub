import api from "./axiosInstance"; // ваш настроенный axios-инстанс

export interface EventType {
    category: any;
    id: number;
    title: string;
    description?: string;
    date_time: string; // Дата в формате ISO
    location: string;
    price: number;
    total_tickets: number;
    status: string;
    is_verified?: boolean;
    categoryId: number|null;
    image_base64: string| null;
    organizer: {
        id: number;
        username: string;
        email: string;
    };
}

export interface PaginatedEvents {
    data: EventType[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    nextPage: number | null;
}

export const fetchPaginatedEvents = async (page: number = 1, limit: number = 10): Promise<PaginatedEvents> => {
    const response = await api.get("/events", { params: { page, limit } });
    const paginatedData = response.data.data; // Получаем объект с массивом и параметрами пагинации
    return {
        data: paginatedData.data,
        total: paginatedData.total,
        page: paginatedData.page,
        limit: paginatedData.limit,
        totalPages: paginatedData.totalPages,
        nextPage: paginatedData.nextPage,
    };
};

export const fetchEventById = async (id: number | string): Promise<EventType> => {
    const response = await api.get(`/events/${id}`);

    return response.data.data;
};

export const createEvent = async (
    event: Omit<EventType, "id" | "organizer">
): Promise<EventType> => {
    const response = await api.post("/events", event);
    return response.data.data;
};

export const updateEvent = async (
    id: number | string,
    event: Partial<EventType>
): Promise<EventType> => {
    const response = await api.patch(`/events/${id}`, event);
    return response.data.data;
};

export const deleteEvent = async (id: number | string): Promise<void> => {
    await api.delete(`/events/${id}`);
};

