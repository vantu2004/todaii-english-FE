import { logError } from "@/utils/LogError";
import { getAllTopics } from "@/api/clients/topicApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, Tag, ChevronDown, ChevronUp } from "lucide-react";

const TopicTags = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  // Cấu hình số lượng tag hiển thị mặc định
  const INITIAL_DISPLAY_COUNT = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const topicRes = await getAllTopics("ARTICLE");
        setTopics(topicRes || []);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedTopics = isExpanded
    ? topics
    : topics.slice(0, INITIAL_DISPLAY_COUNT);

  const remainingCount = topics.length - INITIAL_DISPLAY_COUNT;

  // Skeleton Loader (Đồng bộ style mới)
  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900/60 rounded-lg p-4 border border-neutral-100 dark:border-neutral-800 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-md animate-pulse" />
          <div className="h-5 w-32 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!topics.length) return null;

  return (
    <div className="bg-white dark:bg-neutral-900/60 rounded-lg p-4 border border-neutral-100 dark:border-neutral-800 shadow-sm dark:shadow-none">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-50 dark:border-neutral-800">
        <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-700 dark:text-neutral-300">
          <Tag size={18} />
        </div>
        <h3 className="font-bold text-neutral-900 dark:text-white text-base">
          Chủ đề phổ biến
        </h3>
      </div>

      {/* Tags Cloud */}
      <div className="flex flex-wrap gap-2 mb-1.5">
        {displayedTopics.map((t, i) => (
          <button
            key={i}
            onClick={() => navigate(`/client/article/filter?alias=${t.alias}`)}
            className="
              group flex items-center gap-1.5 px-3 py-1.5 
              bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md 
              text-xs font-medium text-neutral-600 dark:text-neutral-300
              hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900
              transition-colors duration-150
            "
          >
            <Hash
              size={13}
              className="text-neutral-400 group-hover:text-neutral-400 transition-colors"
            />
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      {/* Show More / Show Less Footer */}
      {topics.length > INITIAL_DISPLAY_COUNT && (
        <div className="mt-4 pt-2 border-t border-neutral-50 dark:border-neutral-800">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
              flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400
              hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 w-full justify-center py-2
            "
          >
            {isExpanded ? (
              <>
                <span>Thu gọn</span>
                <ChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Xem thêm {remainingCount} chủ đề</span>
                <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicTags;
