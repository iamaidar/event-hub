export interface TicketSaleDto {
  month: string;
  ticketsSold: number;
}

export interface OrganizerStatDto {
  organizerId: number;
  eventsCreated: number;
  reviewsReceived: number;
  participantsCount: number;
  averageReviewScore: number;
  eventsWithoutReviewsCount: number;
  monthlyTicketSales: TicketSaleDto[];

  // Заказы
  ordersTotal: number;
  ordersPending: number;
  ordersConfirmed: number;
  ordersCancelled: number;
  ordersRefunded: number;
  ordersTotalAmount: number;       // сумма всех заказов

  // Билеты
  ticketsTotal: number;
  ticketsCancelled: number;
  ticketsSold: number;             // ticketsTotal - ticketsCancelled
}