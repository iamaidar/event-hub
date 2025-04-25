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
  allUsersCount: number;
  allNonAdminUsersCount: number;
  totalEvents: number;
  unverifiedEvents: number;
}
export interface TicketSale {
  month: string;      // например "2025‑04"
  ticketsSold: number;
}

export interface OrganizerStatData {
  organizerId: string;
  eventsCreated: number;
  reviewsReceived: number;
  participantsCount: number;
  averageReviewScore: number;
  eventsWithoutReviewsCount: number;
  ordersTotal: number;
  ordersPending: number;
  ordersConfirmed: number;
  ordersCancelled: number;
  ordersRefunded: number;
  ordersTotalAmount: number;

  ticketsTotal: number;
  ticketsCancelled: number;
  ticketsSold: number;

  monthlyTicketSales: TicketSale[];
}



export const fetchAdminStats = async (): Promise<StatData> => {
  const response = await api.get<{ data: StatData }>("/stat/admin"); // Указываем правильный тип
  console.log("Ответ сервера:", response.data); // Проверяем, что приходит от API
  return response.data.data; // Берём `data` из `response.data`
};


export const fetchOrganizerStats = async (
  organizerId: number,
): Promise<OrganizerStatData> => {
  try {
    const response = await api.get<{ data: OrganizerStatData }>(
      `/stat/organizer/${organizerId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Ошибка загрузки данных организатора:", error);
    throw error;
  }
};
