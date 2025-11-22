import { logError } from "../../../../utils/LogError";
import { getSavedArticlesByUser } from "../../../../api/clients/articleApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";

const SavedArticleTags = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const INITIAL_DISPLAY_COUNT = 5;

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

    fetchData();
  }, []);

  const displayedList = isExpanded
    ? articles
    : articles.slice(0, INITIAL_DISPLAY_COUNT);

  const remainingCount = articles.length - INITIAL_DISPLAY_COUNT;

  if (loading) {
    return (
      <div>
        <div className="h-5 w-32 bg-neutral-100 rounded mb-4 animate-pulse" />
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 bg-neutral-100 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!articles.length) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-neutral-100 rounded-md text-neutral-600">
          <Bookmark size={14} />
        </div>
        <h3 className="font-bold text-neutral-900 text-base">Đã lưu</h3>
      </div>

      {/* List */}
      <div className="flex flex-wrap gap-2 mb-4 transition-all duration-300 ease-in-out">
        {displayedList.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(`/client/article/${a.id}`)}
            className="
              w-full
              px-3 py-2
              text-sm text-neutral-700 font-medium
              bg-white border border-neutral-200 rounded-md hover:bg-neutral-50
              transition-colors duration-200
              text-left
            "
          >
            {a.title}
          </button>
        ))}
      </div>

      {/* Show More / Less */}
      {articles.length > INITIAL_DISPLAY_COUNT && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            flex items-center gap-1.5 text-sm font-medium text-neutral-500 
            hover:text-neutral-900 hover:underline decoration-neutral-300 underline-offset-4
            transition-all duration-200 ml-1
          "
        >
          {isExpanded ? (
            <>
              <span>Thu gọn</span>
              <ChevronUp size={14} />
            </>
          ) : (
            <>
              <span>Xem thêm {remainingCount} bài báo khác</span>
              <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default SavedArticleTags;
