import React, { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { saveArticle, unsavedArticle } from "../../../api/clients/articleApi";
import { getArticleSavedStatus } from './../../../api/clients/userApi';
import toast from "react-hot-toast";

const BookmarkButton = ({ articleId }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch saved status on mount
  useEffect(() => {
    const fetchSavedStatus = async () => {
      try {
        const status = await getArticleSavedStatus(articleId);
        setBookmarked(status); 
      } catch (err) {
        console.error("Error fetching saved status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStatus();
  }, [articleId]);

  // Toggle bookmark
  const toggleBookmark = async () => {
    try {
      if (bookmarked) {
        await unsavedArticle(articleId);
        toast.success("Article has been removed from saved");
        setBookmarked(false);
      } else {
        await saveArticle(articleId);
        toast.success("Article has been saved");
        setBookmarked(true);
      }
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
