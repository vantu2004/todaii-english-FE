import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // get current path

  console.log(location)

  const menuItems = [
    {
      name: "Dashboard",
      to: "",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
    },
    {
      name: "Manage Admins",
      to: "admins",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
        </svg>
      ),
    },

    {
      name: "Manage Admins2",
      to: "admins2",
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <Link
          className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
          to=""
        >
          Windmill
        </Link>

        <ul className="mt-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === `/server/${item.to}`;
            return (
              <li key={item.to} className="relative px-6 py-3">
                {isActive && (
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                )}
                <Link
                  className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? "text-gray-800 dark:text-gray-100"
                      : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-400"
                  }`}
                  to={item.to}
                >
                  {item.icon}
                  <span className="ml-4">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
