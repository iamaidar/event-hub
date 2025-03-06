import { Link } from 'react-router-dom';

const AdminHeader = () => {
    return (
        <div className="bg-[#121230] text-white py-4 shadow-lg">
            <div className="container mx-auto px-6 flex items-center justify-between h-16">

                {/* Логотип */}
                <Link to="/admin" className="text-3xl font-bold text-purple-400">
                    EVENT<span className="text-white">HUB</span>
                </Link>

                {/* Навигация (по центру) */}
                <nav className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-4">
                        <Link
                            to="/admin/categories"
                            className="text-sm font-semibold tracking-wider hover:text-gray-300 transition-colors duration-200"
                        >
                            CATEGORIES
                        </Link>
                        <Link
                            to="/admin/events"
                            className="text-sm font-semibold tracking-wider hover:text-gray-300 transition-colors duration-200"
                        >
                            EVENTS
                        </Link>
                    </div>
                </nav>

                {/* Информация об администраторе */}
                <div className="flex items-center space-x-2">
                    <div>
                        <div className="text-sm font-semibold">Admin</div>
                        <div className="text-xs text-gray-400">@event_hub</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHeader;
