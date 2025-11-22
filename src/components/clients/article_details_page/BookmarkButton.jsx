import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import { isSavedArticle } from "../../../api/clients/articleApi";
import { toggleSavedArticle } from "../../../api/clients/userApi";

const BookmarkButton = ({ articleId }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedStatus();
  }, [articleId]);

  const fetchSavedStatus = async () => {
    try {
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
