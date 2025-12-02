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
  Settings,
  LogOut,
  User,
  PenTool,
  BookCopy,
  FolderArchive,
  Mails,
  Newspaper,
  PanelRight,
  TvMinimalPlay,
  ListVideo,
  BookMarked,
  Sparkles,
  CloudUpload,
} from "lucide-react";
import { useState } from "react";
import { logout } from "../../api/servers/authApi";
import { useNavigate } from "react-router-dom";
import { useServerAuthContext } from "../../hooks/servers/useServerAuthContext";

const Sidebar = () => {
  const { authUser } = useServerAuthContext();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(["content"]);

  const toggleMenu = (id) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Lấy role code list
  const userRoles = authUser?.roles?.map((r) => r.code) || [];

  const hasRole = (role) => userRoles.includes(role);

  // Kiểm tra quyền xem menu item
  const canViewMenu = (item) => {
    if (hasRole("SUPER_ADMIN")) return true;

    switch (item.id) {
      case "dashboard":
        return hasRole("USER_MANAGER") || hasRole("CONTENT_MANAGER");
      case "user":
        return hasRole("USER_MANAGER");
      case "dictionary":
      case "article":
      case "video":
      case "learning":
        return hasRole("CONTENT_MANAGER");
      case "settings":
        return false;
      default:
        return false;
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      to: "/server",
      icon: LayoutDashboard,
    },
    {
      id: "user",
      name: "Users",
      icon: Users,
      children: [
        { name: "Admins", to: "/server/admin", icon: UserCog },
        { name: "Users", to: "/server/user", icon: Users },
      ],
    },
    {
      id: "dictionary",
      name: "Dictionaries",
      icon: Languages,
      children: [
        {
          name: "Dictionary API",
          to: "/server/dictionary-api",
          icon: BookMarked,
        },
        { name: "Dictionary", to: "/server/dictionary", icon: Languages },
      ],
    },
    {
      id: "article",
      name: "Articles",
      icon: FileText,
      children: [
        {
          name: "Article Topics",
          to: "/server/article-topic",
          icon: BarChart3,
        },
        { name: "News API", to: "/server/news-api", icon: PanelRight },
        { name: "Articles", to: "/server/article", icon: Newspaper },
      ],
    },
    {
      id: "video",
      name: "Videos",
      icon: Video,
      children: [
        { name: "Video Topics", to: "/server/video-topic", icon: BarChart3 },
        { name: "Youtube", to: "/server/youtube", icon: TvMinimalPlay },
        { name: "Video", to: "/server/video", icon: ListVideo },
      ],
    },
    {
      id: "learning",
      name: "Learning Tools",
      icon: PenTool,
      children: [
        {
          name: "Vocabulary Groups",
          to: "/server/vocab-group",
          icon: FolderArchive,
        },
        { name: "Vocabulary Decks", to: "/server/vocab-deck", icon: BookCopy },
      ],
    },
    {
      id: "settings",
      name: "System Settings",
      icon: Settings,
      children: [
        { name: "Gemini", to: "/server/setting/gemini", icon: Sparkles },
        { name: "SMTP", to: "/server/setting/smtp", icon: Mails },
        { name: "Youtube", to: "/server/setting/youtube", icon: TvMinimalPlay },
        { name: "News API", to: "/server/setting/news-api", icon: BookMarked },
        {
          name: "Cloudinary",
          to: "/server/setting/cloudinary",
          icon: CloudUpload,
        },
      ],
    },
  ];

  // Lọc menu theo quyền
  const filteredMenuItems = menuItems
    .map((item) => {
      if (!canViewMenu(item)) return null;

      // lọc children nếu user không phải SUPER_ADMIN
      let children = item.children || [];
      if (!hasRole("SUPER_ADMIN")) {
        children = children.filter((child) => {
          if (item.id === "user" && hasRole("USER_MANAGER")) {
            return child.to === "/server/user"; // USER_MANAGER chỉ được thấy tab Users
          }
          return true;
        });
      }

      return { ...item, children };
    })
    .filter(Boolean);

  const isPathActive = (path) => location.pathname === path;
  const isParentActive = (children) =>
    children?.some((child) => location.pathname === child.to);

  const navigate = useNavigate();

  const handleLogout = async (email) => {
    setLoading(true);

    try {
      await logout(email);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hidden w-64 bg-white md:flex md:flex-col border-r border-gray-200">
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <a
          href="/server"
          className="flex items-center px-3 mb-6 text-2xl font-extrabold tracking-tight select-none"
        >
          <span className="text-[#13183f]">Todaii</span>
          <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">
            English
          </span>
        </a>

        <nav className="space-y-1">
          {filteredMenuItems.map((item) => {
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

      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            {authUser?.avatar_url ? (
              <img
                src={authUser.avatar_url}
                alt="Avatar"
                className="w-8 h-8 rounded-lg"
              />
            ) : (
              <User className="text-blue-600" size={18} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {authUser?.display_name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {authUser?.email}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Link
              to="/server/profile"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700"
            >
              <Settings size={14} />
              Profile
            </Link>
            <Link
              to="/server/my-dashboard"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700"
            >
              <BarChart3 size={14} /> Dashboard
            </Link>
          </div>
          <button
            onClick={() => handleLogout(authUser?.email)}
            disabled={loading} // Thêm w-full để chiếm hết chiều rộng và đổi màu nền
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-medium text-red-700"
          >
            {loading ? (
              "Logging out..."
            ) : (
              <>
                <LogOut size={14} />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
