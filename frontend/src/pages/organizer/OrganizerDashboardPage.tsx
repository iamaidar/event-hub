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
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  useEffect(() => {
    const getStats = async () => {
      if (!user) {
        setError("Пользователь не авторизован");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchOrganizerStats(user.sub); // передаем ID организатора
        console.log(data);
        setStats(data);
      } catch (err) {
        setError("Ошибка загрузки данных");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, [user]); // добавляем `user` как зависимость, чтобы перезагружать при изменении пользователя

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p>Загрузка...</p>
      </div>
    );
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!stats)
    return <p className="text-gray-500 text-center mt-8">Данные не найдены</p>;

  // Защищаем от NaN
  const eventsData = [
    {
      name: "Events with reviews",
      value: stats?.reviewsReceived ?? 0,
      color: "#8B5CF6",
    },
  ];

  const ratingData = [
    {
      name: "Average rating",
      value: stats?.averageReviewScore ?? 0,
      color: "#9683EC",
    },
    {
      name: "To the maximum",
      value: 5 - (stats?.averageReviewScore ?? 0),
      color: "#D1D5DB",
    },
  ];

  return (
    <div className="px-4 py-6 space-y-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total events"
          value={stats?.eventsCreated ?? 0}
          backgroundColor="#ede9fe"
        />
        <StatCard
          title="Total participants"
          value={stats?.participantsCount ?? 0}
          backgroundColor="#ddd6fe"
        />
        <ReviewsCard
          averageRating={stats?.averageReviewScore ?? 0}
          totalReviews={stats?.reviewsReceived ?? 0}
          backgroundColor="#d6b1fa"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart title="Total participants" data={eventsData} />
        <PieChart data={ratingData} title="Organizer rating" />
      </div>
      <MonthlyTicketSalesChart />
    </div>
  );
}
