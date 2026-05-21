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
  GraduationCap,
  Layers,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { logout } from "@/api/servers/authApi";
import { useNavigate } from "react-router-dom";
import { useServerAuthContext } from "@/hooks/servers/useServerAuthContext";
import { useEffect } from "react";

const Sidebar = () => {
  const { authUser } = useServerAuthContext();
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState([]);

  const toggleMenu = (id) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    // Tìm xem có menu cha nào chứa đường dẫn hiện tại không
    const activeParent = menuItems.find((item) =>
      item.children?.some((child) => location.pathname === child.to),
    );

    if (activeParent) {
      setExpandedMenus((prev) => {
        // Nếu ID cha chưa có trong mảng thì mới thêm vào để tránh trùng lặp
        if (!prev.includes(activeParent.id)) {
          return [...prev, activeParent.id];
        }
        return prev;
      });
    }
  }, [location.pathname]);

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
      case "toeic":
        return hasRole("CONTENT_MANAGER");
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
      id: "toeic",
      name: "TOEIC Tests",
      icon: GraduationCap,
      children: [
        {
          name: "Collections",
          to: "/server/toeic-collection",
          icon: Layers,
        },
        { name: "Tests", to: "/server/toeic-test", icon: FileText },
        { name: "Tags", to: "/server/toeic-tag", icon: Tag },
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
    <div className="hidden w-64 bg-white dark:bg-neutral-900 md:flex md:flex-col border-r border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="flex-1 py-6 px-3 overflow-y-auto">
        <a
          href="/server"
          className="flex items-center px-3 mb-6 text-2xl font-extrabold tracking-tight select-none"
        >
          <span className="text-neutral-900 dark:text-white">Todaii</span>
          <span className="ml-1 text-brand-500 dark:text-brand-400">
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
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
                                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
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

      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            {authUser?.avatar_url ? (
              <img
                src={authUser.avatar_url}
                alt="Avatar"
                className="w-8 h-8 rounded-lg"
              />
            ) : (
              <User
                className="text-neutral-700 dark:text-neutral-300"
                size={18}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
              {authUser?.display_name}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {authUser?.email}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Link
              to="/server/profile"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              <Settings size={14} />
              Profile
            </Link>
            <Link
              to="/server/my-dashboard"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300"
            >
              <BarChart3 size={14} /> Dashboard
            </Link>
          </div>
          <button
            onClick={() => handleLogout(authUser?.email)}
            disabled={loading} // Thêm w-full để chiếm hết chiều rộng và đổi màu nền
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-xs font-medium text-red-600 dark:text-red-400"
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
