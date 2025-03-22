import {useEffect, useState} from "react";
import {fetchAdminStats, StatData} from "../../api/statApi";
import StatCard from "../../components/admin/StatCard";
import PieChart from "../../components/admin/PieChart";
import ReviewsCard from "../../components/admin/ReviewCard.tsx";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<StatData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getStats = async () => {
            try {
                const data = await fetchAdminStats();
                setStats(data);
            } catch (err) {
                setError("Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };

        getStats();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const userRolesChartData = [
        {name: "Regular users", value: stats?.regularUsersCount ?? 0, color: "#D8B4FE"},
        {name: "Organizers", value: stats?.organizersCount ?? 0, color: "#7761FA"},
        {name: "Admins", value: stats?.adminsCount ?? 0, color: "#9683EC"},
    ];

    const userActivityChartData = [
        {name: "Active users", value: stats?.allNonAdminUsersCount ?? 0, color: "#9333EA"},
        {
            name: "Inactive/Banned users",
            value: (stats?.allNonAdminUsersCount ?? 0) - (stats?.activeUsersCount ?? 0),
            color: "#E5E7EB", // Серый
        },
    ];

    const socialUsersChartData = [
        {name: "Social active users", value: stats?.socialActiveUsersCount ?? 0, color: "#7E22CE"},
        {
            name: "Non-social users",
            value: (stats?.allNonAdminUsersCount ?? 0) - (stats?.socialActiveUsersCount ?? 0),
            color: "#D1D5DB", // Серый
        },
    ];

    const eventData = [
        {name: "Ended events", value: stats?.endedEvents ?? 0, color: "#E9D5FF"},
        {name: "Canceled events", value: stats?.canceledEvents ?? 0, color: "#7B68EE"},
        {name: "Upcoming events", value: stats?.upcomingEvents ?? 0, color: "#8A2BE2"},
    ];

    const reviewData = [
        {name: "Verified", value: stats?.verifiedReviewsCount ?? 0, color: "#A020F0"},
        {name: "NonVerified", value: stats?.nonVerifiedReviewsCount ?? 0, color: "#CC75FA"},
    ];

    return (
        <div className="grid grid-cols-3 gap-4 px-8">
            {/* Статистика */}
            <StatCard
                title="Users (non-admin / all)"
                value={[stats?.allNonAdminUsersCount ?? 0, stats?.allUsersCount ?? 0]}
                backgroundColor="#f0dfff"
            />

            <StatCard title="Verified events" value={stats?.totalVerifiedEvents ?? 0} backgroundColor="#E9D5FF"/>
            <ReviewsCard
                totalReviews={stats?.totalReviews ?? 0}
                averageRating={stats?.averageReviewScore ?? 0}
                backgroundColor="#d6b1fa"
            />

            {/* Диаграммы */}
            <PieChart title="User roles" data={userRolesChartData}/>
            <PieChart title="User activity" data={userActivityChartData}/>
            <PieChart title="Social functionality usage" data={socialUsersChartData}/>
            <PieChart title="Event statistics" data={eventData}/>
            <PieChart title="Review statistics" data={reviewData}/>
        </div>
    );
}
