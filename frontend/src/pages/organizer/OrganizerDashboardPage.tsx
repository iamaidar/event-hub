import { useContext, useEffect, useState } from "react";
import { fetchOrganizerStats, OrganizerStatData } from "../../api/statApi.tsx";
import StatCard from "../../components/admin/statistics/StatCard.tsx";
import PieChart from "../../components/admin/statistics/PieChart.tsx";
import ReviewsCard from "../../components/admin/review/ReviewCard.tsx";
import MonthlyTicketSalesChart from "../../components/organizer/MonthlyTicketSalesChart.tsx";
import { AuthContext } from "../../context/AuthContext.tsx";

export default function OrganizerDashboardPage() {
  const [stats, setStats] = useState<OrganizerStatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext) ?? {};

  /* ------------------ DATA FETCH ------------------ */
  useEffect(() => {
    (async () => {
      if (!user) {
        setError("Пользователь не авторизован");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchOrganizerStats(user.sub);
        setStats(data);
      } catch {
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  /* ------------------ RENDER STATES ------------------ */
  if (loading)
    return (
        <div className="flex items-center justify-center h-64">
          <p>Загрузка...</p>
        </div>
    );

  if (error)
    return <p className="mt-8 text-center text-red-500">{error}</p>;

  if (!stats)
    return <p className="mt-8 text-center text-gray-500">Данные не найдены</p>;

  /* ------------------ CHART DATA ------------------ */
  const eventsData = [
    { name: "Events without reviews", value: stats.eventsWithoutReviewsCount, color: "#8B5CF6" },
    { name: "Events with reviews",    value: stats.eventsCreated - stats.eventsWithoutReviewsCount, color: "#8B5CF6" },
  ];

  const ratingData = [
    { name: "Average rating", value: stats.averageReviewScore, color: "#9683EC" },
    { name: "To the maximum", value: 5 - stats.averageReviewScore, color: "#D1D5DB" },
  ];

  const orderStatusData = [
    { name: "Pending",    value: stats.ordersPending,   color: "#c7d2fe" },
    { name: "Confirmed",  value: stats.ordersConfirmed, color: "#a5b4fc" },
    { name: "Cancelled",  value: stats.ordersCancelled, color: "#818cf8" },
    { name: "Refunded",   value: stats.ordersRefunded,  color: "#6366f1" },
  ];

  /* ------------------ JSX ------------------ */
  return (
      <section className="mx-auto max-w-7xl px-4 py-6 space-y-8">
        {/* --- TOP CARDS & ORDER STATUS PIE --- */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* 1‑я ячейка на больших экранах займёт 2 колонки, чтобы круговой график не был тесным */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <PieChart title="Order statuses" data={orderStatusData} />
          </div>

          <StatCard title="Total events" value={stats.eventsCreated} backgroundColor="#ede9fe" />
          <StatCard title="Total orders" value={stats.ordersTotal} backgroundColor="#e9d5ff" />
          <StatCard
              title="Revenue (KGS)"
              value={stats.ordersTotalAmount.toLocaleString()}
              backgroundColor="#d8b4fe"
          />
          <StatCard title="Tickets cancelled" value={stats.ticketsCancelled} backgroundColor="#c084fc" />
          <StatCard title="Total participants" value={stats.participantsCount} backgroundColor="#ddd6fe" />
          <ReviewsCard
              averageRating={stats.averageReviewScore}
              totalReviews={stats.reviewsReceived}
              backgroundColor="#d6b1fa"
          />
        </div>

        {/* --- SECOND ROW OF PIE CHARTS --- */}
        <div className="grid gap-6 md:grid-cols-2">
          <PieChart title="Total participants" data={eventsData} />
          <PieChart title="Organizer rating" data={ratingData} />
        </div>

        {/* --- BAR CHART --- */}
        <MonthlyTicketSalesChart ticketSales={stats.monthlyTicketSales} />
      </section>
  );
}
