import { logError } from "../../../../utils/LogError";
import { getSavedArticlesByUser } from "../../../../api/clients/articleApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useClientAuthContext } from "../../../../hooks/clients/useClientAuthContext";

const SavedArticleTags = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const INITIAL_DISPLAY_COUNT = 5;
  const { isLoggedIn } = useClientAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getSavedArticlesByUser();
        setArticles(res || []);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const displayedList = isExpanded
    ? articles
    : articles.slice(0, INITIAL_DISPLAY_COUNT);

  const remainingCount = articles.length - INITIAL_DISPLAY_COUNT;

  // Skeleton Loader (Updated style)
  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900/60 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
          <div className="h-5 w-32 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
              <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !articles.length) return null;

  return (
    <div className="bg-white dark:bg-neutral-900/60 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800 shadow-sm dark:shadow-none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-50 dark:border-neutral-800">
        <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300">
          <Bookmark size={20} />
        </div>
        <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Đã lưu gần đây</h3>
      </div>

      {/* List Container */}
      <div className="flex flex-col gap-2 mb-2">
        {displayedList.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(`/client/article/${a.id}`)}
            className="group flex items-start gap-3 w-full p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 text-left"
          >
            {/* Icon Box */}
            <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-500 group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 group-hover:shadow-sm dark:group-hover:shadow-none transition-all">
              <FileText size={16} />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white line-clamp-2 leading-relaxed transition-colors">
                {a.title}
              </span>
            </div>

            {/* Hover Arrow (Optional hint) */}
            <div className="flex-shrink-0 self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-neutral-400">
              <ArrowRight size={14} />
            </div>
          </button>
        ))}
      </div>

      {/* Show More / Less Footer */}
      {articles.length > INITIAL_DISPLAY_COUNT && (
        <div className="mt-2 pt-2 border-t border-neutral-50 dark:border-neutral-800">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
              flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400
              hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 w-full justify-center py-2
            "
          >
            {isExpanded ? (
              <>
                <span>Thu gọn danh sách</span>
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Xem thêm {remainingCount} bài viết</span>
                <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedArticleTags;
