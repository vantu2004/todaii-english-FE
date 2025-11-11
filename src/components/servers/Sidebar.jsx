import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UserCog, Users, ChartBarStacked } from "lucide-react";

const Sidebar = () => {
  const location = useLocation(); // get current path

  const menuItems = [
    {
      name: "Dashboard",
      to: "/server",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Manage Admins",
      to: "/server/admin",
      icon: <UserCog className="w-5 h-5" />,
    },
    {
      name: "Manage Users",
      to: "/server/user",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Manage Topics",
      to: "/server/topic",
      icon: <ChartBarStacked className="w-5 h-5" />,
    },
  ];

  return (
    <div className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
      <div className="py-4 text-gray-500 dark:text-gray-400">
        <a
          href="/server"
          className="ml-6 text-2xl font-extrabold tracking-tight select-none"
        >
          <span className="text-[#13183f]">Todaii</span>
          <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
            English
          </span>
        </a>

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
