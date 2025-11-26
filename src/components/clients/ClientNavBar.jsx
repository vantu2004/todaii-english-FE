import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  House,
  User,
  LogOut,
  BookOpen,
  TvMinimalPlay,
  FileText,
  BookA,
  ChevronDown,
  ArrowRight,
  NotebookPen,
  GraduationCap,
  BookMarked,
} from "lucide-react";
import { useClientAuthContext } from "./../../hooks/clients/useClientAuthContext";

const navItems = [
  { label: "Trang chủ", path: "/client/home", icon: House },
  { label: "Video", path: "/client/video", icon: TvMinimalPlay },
  { label: "Từ điển", path: "/client/dictionary", icon: BookA },
  { label: "Sổ tay", path: "/client/notebook", icon: NotebookPen },
  { label: "Học từ vựng", path: "/client/vocabulary", icon: GraduationCap },
];

const ClientNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const { authUser, isLoggedIn, handleLogout } = useClientAuthContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full px-4 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_-20px_rgba(0,0,0,0.1)]"
            : "bg-white/50 backdrop-blur-xl"
        }`}
        style={{
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.04)"
            : "1px solid transparent",
        }}
      >
        {/* Desktop Navigation */}
        <div className="w-full max-w-7xl mx-auto ">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <a
              href="/client/home"
              className="text-2xl font-extrabold tracking-tight select-none"
            >
              <span className="text-[#13183f]">Todaii</span>
              <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
                English
              </span>
            </a>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-0.5 p-1 rounded-2xl bg-neutral-100/60 backdrop-blur-sm">
                {navItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                      `relative px-5 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 rounded-xl ${
                        isActive
                          ? "text-neutral-900 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)]"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5">
                  <span
                    className={`absolute left-0 w-5 h-[1.5px] bg-current transition-all duration-300 ${
                      isMenuOpen ? "top-[9px] rotate-45" : "top-[4px]"
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[9px] w-5 h-[1.5px] bg-current transition-all duration-300 ${
                      isMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute left-0 w-5 h-[1.5px] bg-current transition-all duration-300 ${
                      isMenuOpen ? "top-[9px] -rotate-45" : "top-[14px]"
                    }`}
                  />
                </div>
              </button>

              {/* Desktop Auth */}
              {isLoggedIn ? (
                <div className="relative hidden lg:block" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-2xl hover:bg-neutral-100/80 transition-all duration-300 cursor-pointer group"
                  >
                    {authUser?.avatar_url ? (
                      <img
                        src={authUser.avatar_url}
                        alt=""
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-neutral-200/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                    )}
                    <span className="text-[13px] font-medium text-neutral-700 max-w-[100px] truncate">
                      {authUser?.display_name || "User"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-neutral-400 transition-all duration-300 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 origin-top-right ${
                      isProfileOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        {authUser?.avatar_url ? (
                          <img
                            src={authUser.avatar_url}
                            className="w-12 h-12 rounded-xl object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                            <User size={18} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 truncate">
                            {authUser?.display_name}
                          </p>
                          <p className="text-xs text-neutral-500 truncate mt-0.5">
                            {authUser?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to="/client/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 rounded-xl transition-all duration-200 group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200/80 transition-colors">
                          <User size={14} className="text-neutral-500" />
                        </div>
                        <span className="font-medium">Hồ sơ của tôi</span>
                      </Link>
                      <Link
                        to="/client/saved-articles"
                        className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 rounded-xl transition-all duration-200 group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-neutral-200/80 transition-colors">
                          <BookMarked size={14} className="text-neutral-500" />
                        </div>
                        <span className="font-medium">Bài viết đã lưu</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-neutral-100">
                      <button
                        onClick={() => handleLogout(authUser?.email)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] text-neutral-600 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                          <LogOut
                            size={14}
                            className="text-neutral-500 group-hover:text-red-500"
                          />
                        </div>
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/client/login"
                  className="hidden lg:inline-flex items-center gap-2 h-10 px-5 text-[13px] font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all duration-300 group shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.15)]"
                >
                  <span>Đăng nhập</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            borderTop: isMenuOpen ? "1px solid rgba(0,0,0,0.04)" : "none",
          }}
        >
          <div
            ref={menuRef}
            className="px-4 py-4 bg-white/70 backdrop-blur-2xl"
          >
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300 ${
                        isActive
                          ? "text-neutral-900 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-white/60"
                      }`
                    }
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isActive ? "bg-neutral-100" : "bg-neutral-100/50"
                          }`}
                        >
                          <Icon
                            size={16}
                            className={
                              isActive ? "text-neutral-700" : "text-neutral-400"
                            }
                          />
                        </div>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-neutral-100">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-neutral-50/80 rounded-xl">
                    {authUser?.avatar_url ? (
                      <img
                        src={authUser.avatar_url}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {authUser?.display_name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {authUser?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLogout(authUser?.email)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-[14px] font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200"
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/client/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-[14px] font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)]"
                >
                  <span>Đăng nhập</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default ClientNavBar;
