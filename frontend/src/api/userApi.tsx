import api from "./axiosInstance";

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  firstname?: string;
  lastname?: string;
  gender?: string;
  age?: number;
  email: string;
  role: Role;
  is_active: boolean;
  is_social?: boolean;
  avatar_base64?: string;
  avatar_mime_type?: string;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: number | null;
}

export interface Role {
  id: number;
  name: string;
}

export const fetchPaginatedUsers = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedUsers> => {
  const response = await api.get("/users", { params: { page, limit } });

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

export const fetchUserById = async (id: number | string): Promise<User> => {
  const response = await api.get(`/users/${id}`);

  return response.data.data;
};

export const createUser = async (
  user: Omit<User, "id" | "role" | "createdAt" | "updatedAt">,
): Promise<User> => {
  const response = await api.post("/users", user);

  return response.data.data;
};

export const updateUser = async (
  id: number | string,
  user: Partial<User>,
): Promise<User> => {
  const response = await api.patch(`/users/${id}`, user);

  return response.data.data;
};

export const deleteUser = async (id: number | string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
