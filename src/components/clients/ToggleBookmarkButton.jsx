import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";

const ToggleBookmarkButton = ({
  itemId,
  checkSavedFn,
  toggleSavedFn,
  onToggle,
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
      const nextState = !saved;
      setSaved(nextState);

      try {
        await toggleSavedFn(itemId);
        if (onToggle) {
          onToggle(itemId, nextState);
        }
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
      className={`group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 
      bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/60 
      shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-neutral-800 hover:border-neutral-350 dark:hover:border-neutral-600 
      active:scale-95 ${className}`}
      title={saved ? "Bỏ lưu" : "Lưu lại"}
    >
      <Bookmark
        className={`w-4 h-4 transition-all duration-300 ${
          saved
            ? "text-amber-500 fill-amber-500 scale-105"
            : "text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200"
        }`}
        strokeWidth={2}
      />
    </button>
  );
};

export default ToggleBookmarkButton;
