import api from "./axiosInstance";

export interface StatData {
    totalVerifiedEvents: number;
    endedEvents: number;
    upcomingEvents: number;
    canceledEvents: number;
    totalReviews: number;
    totalUsers: number;
    verifiedReviewsCount: number;
    nonVerifiedReviewsCount: number;
    averageReviewScore: number;
    regularUsersCount: number;
    organizersCount: number;
    adminsCount: number;
    activeUsersCount: number;
    socialActiveUsersCount: number;
    reviewsByMonth?: number[];
}

export const fetchAdminStats = async (): Promise<StatData> => {
    const response = await api.get<{ data: StatData }>("/stat/admin"); // Указываем правильный тип
    console.log("Ответ сервера:", response.data); // Проверяем, что приходит от API
    return response.data.data; // Берём `data` из `response.data`
};
