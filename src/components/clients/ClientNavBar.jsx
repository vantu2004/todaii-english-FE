import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const ClientNavBar = () => {
  const navItems = ["Home", "Video", "Thi thử", "Từ điển"];
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/client/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#13183f] shadow-[0_2px_10px_rgba(0,0,0,0.06)] border-b border-blue-100">
      <div className="w-[90%] max-w-[1200px] mx-auto h-16 flex items-center justify-between">
        {/* Left: logo + links */}
        <div
          className={`flex items-center space-x-20 transition-all duration-300 ${
            isSearchOpen ? "opacity-0 invisible" : "opacity-100 visible"
          }`}
        >
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight select-none"
          >
            <span className="text-white">Todaii</span>
            <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6F48] to-[#F02AA6]">
              English
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={
                  item === "Home"
                    ? "/client/home"
                    : `/${item.toLowerCase().replace(" ", "-")}`
                }
              >
                {({ isActive }) => (
                  <div className="relative flex flex-col items-center group">
                    <span
                      className={`font-medium text-[16px] transition ${
                        isActive
                          ? "text-white"
                          : "text-white hover:text-blue-600"
                      }`}
                    >
                      {item}
                    </span>
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-600 transition-all duration-300
                      ${
                        isActive
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100"
                      }`}
                    ></span>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Center: search input with animation */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
            isSearchOpen
              ? "w-[70%] opacity-100 scale-100"
              : "w-0 opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm các bài báo, video, từ điển..."
              autoFocus={isSearchOpen}
              className="w-full px-6 py-3 pr-24 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
            
            {/* Search button */}
            <button
              type="submit"
              className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition"
            >
              <Search className="text-white" size={18} />
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="text-white" size={20} />
            </button>
          </form>
        </div>

        {/* Right: search icon, burger, login */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isSearchOpen
                ? "opacity-0 invisible"
                : "opacity-100 visible hover:bg-white/10"
            }`}
          >
            <Search className="text-white transition ease-in-out" size={20} />
          </button>

          {/* Burger for filters */}
          <button
            className={`p-2 rounded-lg transition-all duration-300 ${
              isSearchOpen
                ? "opacity-0 invisible"
                : "opacity-100 visible hover:bg-white/10"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="text-white" size={20} />
          </button>

          {/* Login button */}
          <Link
            to="/login"
            className={`text-white font-semibold border border-white/30 px-5 py-2 rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 ${
              isSearchOpen ? "opacity-0 invisible" : "opacity-100 visible"
            }`}
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {!isSearchOpen && isMenuOpen && (
        <div className="md:hidden bg-[#13183f] w-full flex flex-col items-center py-4 space-y-4 animate-slideDown">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={
                item === "Home"
                  ? "/client/home"
                  : `/${item.toLowerCase().replace(" ", "-")}`
              }
              onClick={() => setIsMenuOpen(false)}
              className="text-white font-medium text-lg hover:text-blue-500 transition"
            >
              {item}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default ClientNavBar;