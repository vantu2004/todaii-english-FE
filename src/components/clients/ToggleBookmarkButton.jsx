import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { useClientAuthContext } from "../../hooks/clients/useClientAuthContext";

const ToggleBookmarkButton = ({
  itemId,
  checkSavedFn,
  toggleSavedFn,
  className = "",
}) => {
  const { isLoggedIn } = useClientAuthContext();

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemId) return;

    if (isLoggedIn) {
      fetchSavedStatus();
    } else {
      setSaved(false);
    }
  }, [itemId, isLoggedIn]);

  const fetchSavedStatus = async () => {
    try {
      setLoading(true);
      const status = await checkSavedFn(itemId);
      setSaved(status);
    } catch (err) {
      console.error("Error fetching saved status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!isLoggedIn) {
        toast.error("Please log in to use this feature.");
        return;
      }

      const previousState = saved;
      setSaved(!saved);

      try {
        await toggleSavedFn(itemId);
      } catch (apiErr) {
        setSaved(previousState);
        throw apiErr;
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      if (err.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    }
  };

  if (loading) {
    // Hiển thị icon mờ hoặc spinner nhỏ khi đang load trạng thái ban đầu
    return <Bookmark className="w-5 h-5 text-white/50 animate-pulse" />;
  }

  return (
    <button
      onClick={handleToggle}
      // Loại bỏ bg-gray-100 để tránh bị hình vuông trắng xấu xí trên nền tối
      className={`group relative flex items-center justify-center transition-transform active:scale-95 hover:scale-110 ${className}`}
      title={saved ? "Bỏ lưu" : "Lưu lại"}
    >
      <Bookmark
        className={`w-6 h-6 transition-all duration-300 ${
          saved
            ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
            : "text-gray-600 group-hover:text-yellow-200 drop-shadow-md"
        }`}
        strokeWidth={2}
      />
    </button>
  );
};

export default ToggleBookmarkButton;
