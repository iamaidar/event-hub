import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart } from "lucide-react";
import "./Header.css";

const Header = () => {
    const authContext = useContext(AuthContext);

    return (
        <header className="bg-[#04092C] text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6">
                <Link to="/Home" className="text-2xl font-bold text-purple-400">
                    EVENT<span className="text-white">HUB</span>
                </Link>

                <nav className="flex items-center space-x-6">
                    <div className="hidden md:flex space-x-6 text-sm uppercase">
                        <Link to="/concerts" className="hover:text-gray-300">КОНЦЕРТЫ</Link>
                        <Link to="/sports" className="hover:text-gray-300">СПОРТ</Link>
                        <Link to="/theater" className="hover:text-gray-300">ТЕАТР</Link>
                        <Link to="/kids" className="hover:text-gray-300">ДЕТЯМ</Link>
                    </div>

                    <button className="text-white hover:text-gray-300">
                        <ShoppingCart size={24} />
                    </button>

                    {authContext?.user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">Привет, {authContext.user.email}!</span>
                            <button
                                onClick={authContext.logout}
                                className="bg-purple-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition"
                            >
                                Выйти
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to="/register" className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition">
                                Регистрация
                            </Link>
                            <Link to="/login" className="border border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition">
                                Войти
                            </Link>
                        </div>
                    )}
                </nav>
            </div>

        </header>
    );
};

export default Header;