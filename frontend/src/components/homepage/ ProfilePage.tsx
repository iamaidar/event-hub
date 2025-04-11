import { useAuth } from "../.././hooks/useAuth"; // Импортируем хук для получения данных пользователя
import { Navigate } from "react-router-dom"; // Для редиректа, если пользователя нет или у него нет роли

const ProfilePage = () => {
    const { user, hasRole } = useAuth(); // Получаем пользователя и функцию проверки роли

    // Если нет пользователя, редиректим на страницу входа
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Можно добавить проверку роли, если она важна для доступа к этой странице
    if (!hasRole(["user"])) {
        return <Navigate to="/unauthorized" />;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Мой профиль</h1>
            <div className="space-y-2">
                <p><strong>Имя:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Роль:</strong> {user.role}</p>
                {/* Здесь можно добавить больше информации о пользователе */}
            </div>
        </div>
    );
};

export default ProfilePage;
