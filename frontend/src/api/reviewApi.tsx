import api from "./axiosInstance";
export interface ReviewType {
  id: number;
  createdAt: string;
  updatedAt: string;
  event: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
  };
  rating: number;
  comment?: string;
  is_moderated: boolean;
}

export interface PaginatedReview {
  data: ReviewType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: number | null;
}

export const fetchPaginatedReviews = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedReview> => {
  const response = await api.get("/reviews", { params: { page, limit } });
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

export const updateReview = async (
  id: number | string,
  review: Partial<ReviewType>,
): Promise<ReviewType> => {
  const response = await api.patch(`/reviews/${id}`, review);
  return response.data.data;
};

export const deleteReview = async (id: number | string): Promise<void> => {
  await api.delete(`/reviews/${id}`);
};

export const fetchPaginatedReviewsByEventId = async (
  eventId: number,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedReview> => {
  const response = await api.get("/reviews", {
    params: { page, limit, eventId },
  });
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
