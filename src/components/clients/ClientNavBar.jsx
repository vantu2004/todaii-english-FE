import React from "react";
import { Link, NavLink } from "react-router-dom";

const ClientNavBar = () => {
  return (
    <nav className="bg-white shadow-sm mt-4">
      <div className="flex justify-between items-center w-[90%] max-w-[1200px] mx-auto h-16">
        {/* Left side: logo + nav links */}
        <div className="flex items-center space-x-10">
          <a
            href="/"
            className="text-2xl font-extrabold tracking-tight select-none"
          >
            <span className="text-[#13183f]">Todaii</span>
            <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
              English
            </span>
          </a>

          <div className="flex ml-10 items-center space-x-20">
            {["Home", "Video", "Thi thử", "Từ điển"].map((item, idx) => (
              <NavLink
                key={idx}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                className={({ isActive }) =>
                  `font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                      : "text-gray-700 hover:text-indigo-500"
                  }`
                }
              >
                {item}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right side: login */}
        <div>
          <Link
            to="/login"
            className="text-indigo-600 font-semibold border border-indigo-500 px-4 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition duration-200"
          >
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavBar;
