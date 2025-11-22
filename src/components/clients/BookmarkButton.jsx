import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { isSavedArticle } from "../../api/clients/articleApi";
import { toggleSavedArticle } from "../../api/clients/userApi";
import { useClientAuthContext } from "../../hooks/clients/useClientAuthContext";
import toast from "react-hot-toast";

const BookmarkButton = ({ articleId }) => {
  const { isLoggedIn } = useClientAuthContext();

  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedStatus();
    } else {
      setBookmarked(false);
    }
  }, [articleId, isLoggedIn]);

  const fetchSavedStatus = async () => {
    try {
      setLoading(true);

      const status = await isSavedArticle(articleId);
      setBookmarked(status);
    } catch (err) {
      console.error("Error fetching saved status:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    try {
      await toggleSavedArticle(articleId);
      await fetchSavedStatus();
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      if (err.status === 401) {
        toast.error("Please log in to save articles.");
      }
    }
  };

  if (loading) return null;

  return (
    <button
      onClick={toggleBookmark}
      className="p-2 hover:bg-gray-100 rounded-lg transition-transform transform hover:scale-110"
      title={bookmarked ? "Bỏ lưu bài viết" : "Lưu bài viết"}
    >
      {bookmarked ? (
        <BookmarkCheck className="w-6 h-6 text-blue-600 transition-colors" />
      ) : (
        <Bookmark className="w-6 h-6 text-gray-400 transition-colors" />
      )}
    </button>
  );
};

export default BookmarkButton;
