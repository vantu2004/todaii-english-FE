import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  Video,
  FileText,
  BookMarked,
} from "lucide-react";
import { useClientAuthContext } from "./../../hooks/clients/useClientAuthContext";

const navItems = [
  { label: "Home", path: "/client/home", icon: BookOpen },
  { label: "Video", path: "/video", icon: Video },
  { label: "Thi thử", path: "/thi-thu", icon: FileText },
  { label: "Từ điển", path: "/tu-dien", icon: BookMarked },
];

const ClientNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const { authUser, isLoggedIn, handleLogout } = useClientAuthContext();

  console.log(isLoggedIn)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeOnOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100"
          : "bg-white border-b border-blue-50 shadow-sm"
      }`}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo with gradient */}
        <Link
          to="/"
          className="text-3xl font-extrabold select-none flex-shrink-0 group ml-13"
        >
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-blue-600 transition-all duration-300">
            Todaii
          </span>
          <span className="ml-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
            English
          </span>
        </Link>

        {/* Desktop menu with icons */}
        <div className="hidden lg:flex items-center gap-2 -ml-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-blue-500"}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2.5 rounded-xl hover:bg-blue-50 transition-all duration-200 active:scale-95"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <X size={24} className="text-blue-600" />
            ) : (
              <Menu size={24} className="text-blue-600" />
            )}
          </button>

          {/* Profile / Login */}
          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 border border-blue-100 hover:border-blue-200 active:scale-95"
              >
                {authUser?.avatar ? (
                  <img
                    src={authUser.avatar}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-300 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-md">
                    <User size={20} className="text-white" />
                  </div>
                )}

                <span className="text-gray-800 font-semibold text-[15px]">
                  {authUser?.display_name || "User"}
                </span>
              </button>

              {/* Dropdown with animation */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-blue-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Top user info with gradient background */}
                  <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl border-b border-blue-100">
                    {authUser?.avatar ? (
                      <img
                        src={authUser.avatar}
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-300 shadow-sm"
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-md">
                        <User size={22} className="text-white" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {authUser?.display_name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {authUser?.email}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown actions */}
                  <div className="py-2">
                    <Link
                      to="/client/profile"
                      className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-150 font-medium"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="text-xl">👤</span>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/client/saved-articles"
                      className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-150 font-medium"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="text-xl">📚</span>
                      <span>Saved Articles</span>
                    </Link>

                    <Link
                      to="/client/settings"
                      className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-150 font-medium"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <span className="text-xl">⚙️</span>
                      <span>Settings</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() => handleLogout(authUser?.email)}
                    className="w-full text-left px-5 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 border-t border-gray-100 transition-colors duration-150 flex items-center gap-3 font-medium rounded-b-2xl"
                  >
                    <LogOut size={18} />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/client/login"
              className="hidden lg:block bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 transition-all duration-200 active:scale-95"
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden flex flex-col gap-2 py-4 px-4 bg-gradient-to-b from-white to-blue-50/30 border-t border-blue-100 animate-in slide-in-from-top-2 duration-200"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      className={isActive ? "text-white" : "text-blue-500"}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Mobile Login / Logout */}
          {isLoggedIn ? (
            <button
              onClick={() => handleLogout(authUser?.email)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-2 border-t border-blue-100 pt-4"
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          ) : (
            <Link
              to="/client/login"
              onClick={() => setIsMenuOpen(false)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-center shadow-md mt-2"
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default ClientNavBar;
