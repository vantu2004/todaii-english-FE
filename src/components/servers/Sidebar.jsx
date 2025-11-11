import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCog,
  Users,
  BarChart3,
  Languages,
  ChevronDown,
  FileText,
  Video,
  Image,
  Settings,
  LogOut,
  User,
  BookOpen,
  PenTool,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchProfile } from "../../api/servers/adminApi";
import { logout } from "../../api/servers/authApi";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [profile, setProfile] = useState(null); // state lưu profile

  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(["content"]);

  const toggleMenu = (id) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      to: "/server",
      icon: LayoutDashboard,
    },
    {
      id: "user-management",
      name: "User Management",
      icon: Users,
      children: [
        { name: "Admins", to: "/server/admin", icon: UserCog },
        { name: "Users", to: "/server/user", icon: Users },
      ],
    },
    {
      id: "content",
      name: "Content Management",
      icon: BookOpen,
      children: [
        { name: "Topics", to: "/server/topic", icon: BarChart3 },
        { name: "Articles", to: "/server/articles", icon: FileText },
        { name: "Videos", to: "/server/videos", icon: Video },
        { name: "Images", to: "/server/images", icon: Image },
      ],
    },
    {
      id: "dictionary",
      name: "Dictionary",
      icon: Languages,
      children: [
        { name: "Manage Words", to: "/server/dictionary", icon: Languages },
        {
          name: "Word Categories",
          to: "/server/dictionary/categories",
          icon: BarChart3,
        },
        {
          name: "Import/Export",
          to: "/server/dictionary/import",
          icon: FileText,
        },
      ],
    },
    {
      id: "learning",
      name: "Learning Tools",
      icon: PenTool,
      children: [
        { name: "Quizzes", to: "/server/quizzes", icon: PenTool },
        { name: "Flashcards", to: "/server/flashcards", icon: BookOpen },
        { name: "Exercises", to: "/server/exercises", icon: FileText },
      ],
    },
    {
      id: "settings",
      name: "System Settings",
      to: "/server/settings",
      icon: Settings,
    },
  ];

  const isPathActive = (path) => location.pathname === path;
  const isParentActive = (children) =>
    children?.some((child) => location.pathname === child.to);

  const navigate = useNavigate();

  const handleFetchProfile = async () => {
    try {
      const response = await fetchProfile();
      setProfile(response);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleLogout = async (email) => {
    try {
      await logout(email);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    handleFetchProfile();
  }, []);

  return (
    <div className="hidden w-64 bg-white md:flex md:flex-col border-r border-gray-200">
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        {/* Logo */}
        <a
          to="/"
          className="flex items-center px-3 mb-6 text-2xl font-extrabold tracking-tight select-none"
        >
          <span className="text-[#13183f]">Todaii</span>
          <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
            English
          </span>
        </a>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const hasChildren = item.children?.length > 0;
            const isExpanded = expandedMenus.includes(item.id);
            const isActive = item.to ? isPathActive(item.to) : false;
            const isChildActive = hasChildren && isParentActive(item.children);
            const Icon = item.icon;

            return (
              <div key={item.id}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full"
                  >
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                        isChildActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.name}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                ) : (
                  <Link to={item.to}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                  </Link>
                )}

                {hasChildren && isExpanded && (
                  <div className="mt-1 ml-6 space-y-1">
                    {item.children.map((child) => {
                      const isChildItemActive = isPathActive(child.to);
                      const ChildIcon = child.icon;

                      return (
                        <Link key={child.to} to={child.to}>
                          <div
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                              isChildItemActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <ChildIcon size={16} />
                            <span className="text-sm">{child.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <User className="text-blue-600" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {profile?.display_name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {profile?.email}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/server/profile"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700"
          >
            <Settings size={14} />
            Settings
          </Link>
          <button
            onClick={() => {
              handleLogout(profile?.email);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
