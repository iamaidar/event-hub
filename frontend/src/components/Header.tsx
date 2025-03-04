import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import "./Header.css";
import Filter from "./HomePage/Filter";

const Header = () => {
  const authContext = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Управление мобильным меню

  return (
    <header className="bg-[#04092C] text-white py-4 shadow-md">
      <div className="md:flex items-center w-full px-4 md:px-8 lg:px-16">
        {/* Лого и бургер-кнопка */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link
            to="/Home"
            className="text-3xl font-bold text-purple-400 flex-grow"
          >
            EVENT<span className="text-white">HUB</span>
          </Link>

          {/* Бургер-кнопка (мобильное меню) */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Навигация (десктоп) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm uppercase mx-auto">
          <Link to="/concerts" className="hover:text-gray-300 font-bold">
            КОНЦЕРТЫ
          </Link>
          <Link to="/sports" className="hover:text-gray-300 font-bold">
            СПОРТ
          </Link>
          <Link to="/theater" className="hover:text-gray-300 font-bold">
            ТЕАТР
          </Link>
          <Link to="/kids" className="hover:text-gray-300 font-bold">
            ДЕТЯМ
          </Link>
        </nav>

        {/* Корзина и Авторизация */}
        <nav className="hidden md:flex items-center space-x-6">
          <button className="text-white hover:text-gray-300">
            <ShoppingCart size={24} />
          </button>

          {authContext?.user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Привет, {authContext.user.email}!</span>
              <button
                onClick={authContext.logout}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full transition"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full transition"
              >
                Регистрация
              </Link>
              <Link
                to="/login"
                className="border border-white text-white py-2 px-4 rounded-full hover:bg-white hover:text-black transition"
              >
                Войти
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Мобильное меню (бургер) */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#04092C] text-white flex flex-col items-center py-4 space-y-5">
          <Link
            to="/concerts"
            className="hover:text-gray-300 font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            КОНЦЕРТЫ
          </Link>
          <Link
            to="/sports"
            className="hover:text-gray-300 font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            СПОРТ
          </Link>
          <Link
            to="/theater"
            className="hover:text-gray-300 font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            ТЕАТР
          </Link>
          <Link
            to="/kids"
            className="hover:text-gray-300 font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            ДЕТЯМ
          </Link>

          <button
            className="text-white hover:text-gray-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingCart size={24} />
          </button>

          {authContext?.user ? (
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm">Привет, {authContext.user.email}!</span>
              <button
                onClick={() => {
                  authContext.logout();
                  setIsMenuOpen(false);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full transition"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Регистрация
              </Link>
              <Link
                to="/login"
                className="border border-white text-white py-2 px-4 rounded-full hover:bg-white hover:text-black transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Войти
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Фильтр */}
      <div className="flex justify-center mt-4">
        <Filter />
      </div>
    </header>
  );
};

export default Header;
