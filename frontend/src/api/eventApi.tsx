import api from "./axiosInstance";

export interface EventType {
    id?: number;
    title: string;
    description?: string;
    date_time: string;
    location: string;
    category?: {
        id: number;
        name: string;
    };
    organizer: {
        id: number;
        username: string;
    };
    price: number;
    total_tickets: number;
    status: string;
    is_verified?: boolean;
}

export const fetchEvents = async (): Promise<EventType[]> => {
    const response = await api.get("events");
    return response.data;
};

export const fetchEventById = async (id: number | string): Promise<EventType> => {
    const response = await api.get(`events/${id}`);
    return response.data;
};

export const createEvent = async (
    event: Omit<EventType, "id" | "organizer">
): Promise<EventType> => {
    const response = await api.post("events", event);
    return response.data;
};

export const updateEvent = async (
    id: number | string,
    event: Partial<EventType>
): Promise<EventType> => {
    const response = await api.put(`events/${id}`, event);
    return response.data;
};

export const deleteEvent = async (id: number | string): Promise<void> => {
    await api.delete(`events/${id}`);
};
