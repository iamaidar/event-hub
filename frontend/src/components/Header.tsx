import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
    const authContext = useContext(AuthContext);

    return (
        <header className="bg-blue-600 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4">
                <Link to="/" className="text-2xl font-bold">
                    EventHub
                </Link>

                <nav className="space-x-4">
                    {authContext?.user ? (
                        <>
                            <span className="text-lg">Привет, {authContext.user.email}!</span>
                            <button
                                onClick={authContext.logout}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Вход</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;