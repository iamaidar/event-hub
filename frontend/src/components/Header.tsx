import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {ShoppingCart, Menu, X, User, Users, LogOut, Tickets } from "lucide-react";
import { getCurrentUser } from "../api/userApi";
import "./Header.css";
import Filter from "./homepage/Filter";

const Header = () => {
  const authContext = useContext(AuthContext);
  const [profile, setProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Загрузка полного профиля (с аватаром) при монтировании
  useEffect(() => {
    if (authContext?.user) {
      getCurrentUser()
          .then((u) => setProfile(u))
          .catch((err) => console.error("Ошибка при getCurrentUser:", err));
    }
  }, [authContext?.user]);

  // Закрыть дропдаун при клике вне его
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
          profileRef.current &&
          e.target instanceof Node &&
          !profileRef.current.contains(e.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!authContext) return <div>Loading...</div>;

  const displayName = profile?.username || authContext.user?.name;
  const displayEmail = profile?.email || authContext.user?.email;
  const avatarSrc = profile?.avatar_base64
      ? `data:${profile.avatar_mime_type};base64,${profile.avatar_base64}`
      : null;

  const toggleProfileDropdown = () =>
      setIsProfileDropdownOpen((o) => !o);

  const handleLogout = () => {
    authContext.logout?.();
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
      <header className="bg-[#04092C] text-white py-4 shadow-md">
        <div className="md:flex items-center w-full px-4 md:px-8 lg:px-16">
          {/* Logo + Burger */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link to="/Home" className="text-3xl font-bold text-purple-400 flex-grow">
              EVENT<span className="text-white">HUB</span>
            </Link>
            <button
                onClick={() => setIsMenuOpen((o) => !o)}
                className="md:hidden"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex mx-auto space-x-6 uppercase text-sm font-bold">
            <Link to="/concerts" className="hover:text-gray-300">CONCERTS</Link>
            <Link to="/sports" className="hover:text-gray-300">SPORTS</Link>
            <Link to="/theater" className="hover:text-gray-300">THEATER</Link>
            <Link to="/kids" className="hover:text-gray-300">FOR KIDS</Link>
          </nav>

          {/* Desktop Profile & Cart */}
          <nav className="hidden md:flex items-center space-x-6">
            {authContext.user?.role === "user" && (
                <Link to="/user/orders/my" className="hover:text-gray-300">
                  <ShoppingCart size={24} />
                </Link>
            )}

            {authContext.user ? (
                <div className="relative" ref={profileRef}>
                  <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center space-x-2"
                  >
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                          {displayName?.charAt(0)}
                        </div>
                    )}
                    <span className="text-sm">{displayName}</span>
                  </button>

                  {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-xl rounded-lg overflow-hidden z-50">
                        <div className="p-4 border-b">
                          <h3 className="font-bold text-gray-800">{displayName}</h3>
                          <p className="text-gray-500 text-sm">{displayEmail}</p>
                        </div>
                        <div className="py-2">
                          <Link
                              to="/user/profile/my-info"
                              className="flex items-center px-4 py-3 hover:bg-gray-50"
                              onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <User className="w-5 h-5 mr-3 text-purple-600" />
                            My profile
                          </Link>
                          <Link
                              to="/user/profile/my-tickets"
                              className="flex items-center px-4 py-3 hover:bg-gray-50"
                              onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Tickets  className="w-5 h-5 mr-3 text-purple-600" />
                            My tickets
                          </Link>
                          <Link
                              to="/user/profile/my-groups"
                              className="flex items-center px-4 py-3 hover:bg-gray-50"
                              onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Users className="w-5 h-5 mr-3 text-purple-600" />
                            My groups
                          </Link>
                        </div>
                        <div className="border-t">
                          <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            <LogOut className="w-5 h-5 mr-3 text-red-600" />
                            Logout
                          </button>
                        </div>
                      </div>
                  )}
                </div>
            ) : (
                <div className="flex space-x-4">
                  <Link
                      to="/register"
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full"
                  >
                    Register
                  </Link>
                  <Link
                      to="/login"
                      className="border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black"
                  >
                    Login
                  </Link>
                </div>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden bg-[#04092C] text-white flex flex-col items-center py-4 space-y-5">
              <Link to="/concerts" className="hover:text-gray-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                CONCERTS
              </Link>
              <Link to="/sports" className="hover:text-gray-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                SPORTS
              </Link>
              <Link to="/theater" className="hover:text-gray-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                THEATER
              </Link>
              <Link to="/kids" className="hover:text-gray-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                FOR KIDS
              </Link>

              {authContext.user?.role === "user" && (
                  <Link to="/user/orders/my" className="hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart size={24} />
                  </Link>
              )}

              {authContext.user ? (
                  <div className="w-full px-4 border-t border-gray-700 pt-4">
                    <div className="flex items-center space-x-3 mb-4">
                      {avatarSrc ? (
                          <img
                              src={avatarSrc}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover"
                          />
                      ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                            {displayName?.charAt(0)}
                          </div>
                      )}
                      <div>
                        <h4 className="font-bold">{displayName}</h4>
                        <p className="text-gray-400 text-sm">{displayEmail}</p>
                      </div>
                    </div>
                    <Link to="/user/profile/my-info" className="flex items-center py-3 text-purple-600 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-5 h-5 mr-3" />
                      My profile
                    </Link>
                    <Link to="/user/profile/my-tickets" className="flex items-center py-3 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      <Tickets className="w-5 h-5 mr-3" />
                      My tickets
                    </Link>
                    <Link to="/user/profile/my-groups" className="flex items-center py-3 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      <Users className="w-5 h-5 mr-3" />
                      My groups
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center py-3 hover:text-gray-300 text-left">
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </div>
              ) : (
                  <div className="flex space-x-4 pt-4 border-t border-gray-700">
                    <Link to="/register" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full" onClick={() => setIsMenuOpen(false)}>
                      Register
                    </Link>
                    <Link to="/login" className="border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </div>
              )}
            </div>
        )}

        {/* Filter */}
        <div className="flex justify-center mt-4">
          <Filter />
        </div>
      </header>
  );
};

export default Header;
