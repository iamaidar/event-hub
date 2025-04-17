import api from "./axiosInstance";
import { EventType } from "./eventApi";
import { User } from "./userApi";

export interface EventGroupType {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  event: EventType;
  creator: User;
  title: string;
  description?: string;
  status: string;
  genderRequirement?: string;
  minAge?: number;
  maxAge?: number;
  members_limit: number;
  members: GroupMember[];
}

export interface GroupMember {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  group: EventGroupType;
  user: User;
  joinedAt: Date;
}

export interface PaginatedEventGroups {
  data: EventGroupType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: number | null;
}

export type CreateEventGroupInput = {
  eventId: number;
  title: string;
  description?: string;
  status: "active" | "closed";
  genderRequirement?: "male" | "female" | "any";
  minAge?: number;
  maxAge?: number;
};

export const createEventGroup = async (
  group: CreateEventGroupInput,
): Promise<EventGroupType> => {
  const response = await api.post("/event-group", group);
  return response.data.data;
};

export const fetchPaginatedEventGroups = async (
  page: number = 1,
  limit: number = 10,
  eventId?: number,
): Promise<PaginatedEventGroups> => {
  const response = await api.get("/event-group", {
    params: { page, limit, eventId },
  });
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

export const isUserBoughtTicket = async (eventId: string) => {
  const response = await api.get("/event-group/check-is-ticket-bought", {
    params: { eventId: eventId },
  });

  return response.data.data;
};

export const joinToGroup = async (eventGroupId: string | number) => {
  const response = await api.post(`/event-group/join/${eventGroupId}`);

  return response.data.data;
};
