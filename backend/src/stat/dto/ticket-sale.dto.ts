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
  monthlyTicketSales: TicketSaleDto[];   // ← новое поле
}