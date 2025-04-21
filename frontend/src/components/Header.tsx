import { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, Menu, X, User, Ticket, Users, LogOut, Tickets } from "lucide-react";
import "./Header.css";
import Filter from "./homepage/Filter";

const Header = () => {
  const authContext = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    authContext?.logout(); // Safe logout using optional chaining
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && event.target instanceof Node &&
          !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if authContext is available (it might be null if not provided)
  if (!authContext) {
    return <div>Loading...</div>; // Or any fallback UI for when authContext is not available
  }

  return (
      <header className="bg-[#04092C] text-white py-4 shadow-md">
        <div className="md:flex items-center w-full px-4 md:px-8 lg:px-16">
          {/* Logo and burger menu button */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <Link to="/Home" className="text-3xl font-bold text-purple-400 flex-grow">
              EVENT<span className="text-white">HUB</span>
            </Link>

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm uppercase mx-auto">
            <Link to="/concerts" className="hover:text-gray-300 font-bold">CONCERTS</Link>
            <Link to="/sports" className="hover:text-gray-300 font-bold">SPORTS</Link>
            <Link to="/theater" className="hover:text-gray-300 font-bold">THEATER</Link>
            <Link to="/kids" className="hover:text-gray-300 font-bold">FOR KIDS</Link>
          </nav>

          {/* Desktop Profile and Cart */}
          <nav className="hidden md:flex items-center space-x-6">
            {authContext?.user?.role === 'user' && (
                <Link to="user/orders/my" className="text-white hover:text-gray-300">
                  <ShoppingCart size={24} />
                </Link>
            )}

            {authContext?.user ? (
                <div className="relative" ref={profileRef}>
                  <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      {authContext.user.name?.charAt(0)}
                    </div>
                    <span className="text-sm text-white">
                  {authContext.user.name}
                </span>
                  </button>

                  {/* Desktop Profile Dropdown */}
                  {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-xl rounded-lg border border-gray-100 overflow-hidden z-50">
                        <div className="p-4 border-b">
                          <h3 className="font-bold text-gray-800">{authContext.user.name}</h3>
                          <p className="text-gray-500 text-sm">{authContext.user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link to="/user/profile/my-info" className="flex items-center px-4 py-3 hover:bg-gray-50" onClick={() => setIsProfileDropdownOpen(false)}>
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <User className="text-purple-600 w-4 h-4" />
                            </div>
                            <span>My profile</span>
                          </Link>
                          <Link to="/user/profile/my-tickets" className="flex items-center px-4 py-3 hover:bg-gray-50" onClick={() => setIsProfileDropdownOpen(false)}>
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <Tickets className="text-purple-600 w-4 h-4" />
                            </div>
                            <span>My tickets</span>
                          </Link>
                          <Link to="/user/profile/my-groups" className="flex items-center px-4 py-3 hover:bg-gray-50" onClick={() => setIsProfileDropdownOpen(false)}>
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <Users className="text-purple-600 w-4 h-4" />
                            </div>
                            <span>my groups</span>
                          </Link>
                        </div>
                        <div className="border-t">
                          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 hover:bg-gray-50 text-left">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <LogOut className="text-red-600 w-4 h-4" />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                  )}
                </div>
            ) : (
                <div className="flex space-x-4">
                  <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full transition">
                    Register
                  </Link>
                  <Link to="/login" className="border border-white text-white py-2 px-4 rounded-full hover:bg-white hover:text-black transition">
                    Login
                  </Link>
                </div>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="md:hidden bg-[#04092C] text-white flex flex-col items-center py-4 space-y-5">
              {/* Main Navigation Links */}
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

              {/* Shopping Cart */}
              {authContext?.user?.role === 'user' && (
                  <Link to="user/orders/my" className="text-white hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart size={24} />
                  </Link>
              )}

              {/* Mobile Profile Section */}
              {authContext?.user ? (
                  <div className="w-full px-4 border-t border-gray-700 pt-4">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                        {authContext.user.name}
                      </div>
                      <div>
                        <h4 className="font-bold">{authContext.user.name || "Пользователь"}</h4>
                        <p className="text-gray-400 text-sm">{authContext.user.email}</p>
                      </div>
                    </div>

                    {/* Profile Links */}
                    <Link to="/user/profile/my-info" className="flex items-center py-3 text-purple-600 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-5 h-5 mr-3" />
                      <span>My profile</span>
                    </Link>
                    <Link to="/user/profile/my-tickets" className="flex items-center py-3 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      <Ticket className="w-5 h-5 mr-3" />
                      <span>My tickets</span>
                    </Link>
                    <Link to="/user/profile/my-groups" className="flex items-center py-3 hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      <Users className="w-5 h-5 mr-3" />
                      <span>My groups</span>
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center py-3 hover:text-gray-300 text-left">
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
              ) : (
                  <div className="flex space-x-4 pt-4 border-t border-gray-700">
                    <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-full transition" onClick={() => setIsMenuOpen(false)}>
                      Register
                    </Link>
                    <Link to="/login" className="border border-white text-white py-2 px-4 rounded-full hover:bg-white hover:text-black transition" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </div>
              )}
            </div>
        )}

        {/* Filter Section */}
        <div className="flex justify-center mt-4">
          <Filter />
        </div>
      </header>
  );
};

export default Header;
