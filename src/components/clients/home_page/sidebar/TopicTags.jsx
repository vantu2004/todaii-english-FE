import { logError } from "../../../../utils/LogError";
import { getAllTopics } from "../../../../api/clients/topicApi";
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
        const topicRes = await getAllTopics();
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
      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-neutral-100 rounded-xl animate-pulse" />
          <div className="h-5 w-32 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 bg-neutral-100 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!topics.length) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-50">
        <div className="p-2 bg-neutral-100 rounded-xl text-neutral-700">
          <Tag size={20} />
        </div>
        <h3 className="font-bold text-neutral-900 text-lg">Chủ đề phổ biến</h3>
      </div>

      {/* Tags Cloud */}
      <div className="flex flex-wrap gap-2 mb-2">
        {displayedTopics.map((t, i) => (
          <button
            key={i}
            onClick={() => navigate(`/client/article/filter?alias=${t.alias}`)}
            className="
              group flex items-center gap-1.5 px-4 py-2 
              bg-white border border-neutral-200 rounded-full 
              text-sm font-medium text-neutral-600
              hover:border-neutral-900 hover:bg-neutral-900 hover:text-white hover:shadow-md
              transition-all duration-300 ease-out
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
        <div className="mt-4 pt-2 border-t border-neutral-50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
              flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 
              hover:text-neutral-900 transition-colors duration-200 w-full justify-center py-2
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
