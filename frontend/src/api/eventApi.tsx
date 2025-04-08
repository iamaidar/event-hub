import api from "./axiosInstance";

export type EventStatus =
    | "pending"
    | "published"
    | "completed"
    | "cancelled"
    | "inactive"
    | "deleted";

export const EventStatusList: EventStatus[] = [
    "pending",
    "published",
    "completed",
    "cancelled",
    "inactive",
    "deleted",
];

export interface EventType {
    id: number;
    title: string;
    description?: string;
    date_time: string;
    location: string;
    price: number;
    total_tickets: number;
    status: EventStatus;
    is_verified?: boolean;
    categoryId: number | null;
    image_base64: string | undefined;
    category: any;
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

export interface EventFilters {
    status?: EventStatus[];
    isVerified?: boolean;
    title?: string;
    categoryId?: number;
    organizerId?: number;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
}

// 🔄 Получение событий с фильтрацией и пагинацией
export const fetchPaginatedEvents = async (
    page: number = 1,
    limit: number = 10,
    filters: EventFilters = {}
): Promise<PaginatedEvents> => {
    const params = {
        page,
        limit,
        ...filters,
        ...(filters.status ? { status: filters.status } : {}),
    };

    const response = await api.get("/events", { params });
    const paginatedData = response.data.data;

    return {
        data: paginatedData.data,
        total: paginatedData.total,
        page: paginatedData.page,
        limit: paginatedData.limit,
        totalPages: paginatedData.totalPages,
        nextPage: paginatedData.nextPage,
    };
};

// 🔍 Получение одного события
export const fetchEventById = async (
    id: number | string
): Promise<EventType> => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
};

// 🆕 Создание события
export const createEvent = async (
    event: Omit<EventType, "id" | "organizer" | "status" | "is_verified">
): Promise<EventType> => {
    // status и is_verified выставляются на сервере: pending / false
    const response = await api.post("/events", event);
    return response.data.data;
};

// 🛠 Обновление события
export const updateEvent = async (
    id: number | string,
    event: Partial<Omit<EventType, "organizer">>
): Promise<EventType> => {
    // Статус можно изменять вручную (например, админом)
    const response = await api.patch(`/events/${id}`, event);
    return response.data.data;
};

// ❌ Удаление события
export const deleteEvent = async (id: number | string): Promise<void> => {
    await api.delete(`/events/${id}`);
};

