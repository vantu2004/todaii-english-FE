import { logError } from "../../../../utils/LogError";
import { getAllTopics } from "../../../../api/clients/topicApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hash, Tag, ChevronDown, ChevronUp } from "lucide-react";

const TopicTags = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false); // State quản lý trạng thái mở rộng
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

  // Tính toán danh sách hiển thị dựa trên state isExpanded
  const displayedTopics = isExpanded
    ? topics
    : topics.slice(0, INITIAL_DISPLAY_COUNT);

  const remainingCount = topics.length - INITIAL_DISPLAY_COUNT;

  // Skeleton Loader
  if (loading) {
    return (
      <div>
        <div className="h-5 w-32 bg-neutral-100 rounded mb-4 animate-pulse" />
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-9 w-20 bg-neutral-100 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!topics.length) return null;

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-neutral-100 rounded-md text-neutral-600">
          <Tag size={14} />
        </div>
        <h3 className="font-bold text-neutral-900 text-base">
          Chủ đề phổ biến
        </h3>
      </div>

      {/* Tags Cloud */}
      <div className="flex flex-wrap gap-2 mb-4 transition-all duration-300 ease-in-out">
        {displayedTopics.map((t, i) => (
          <button
            key={i}
            onClick={() => navigate(`/client/article/filter?alias=${t.alias}`)}
            className="
              group flex items-center gap-1.5 px-3.5 py-2 
              bg-white border border-neutral-200 rounded-full 
              text-sm font-medium text-neutral-600
              hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 hover:shadow-sm
              transition-all duration-200
            "
          >
            <Hash
              size={12}
              className="text-neutral-400 group-hover:text-neutral-500 transition-colors"
            />
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {topics.length > INITIAL_DISPLAY_COUNT && (
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
              <span>Xem thêm {remainingCount} chủ đề khác</span>
              <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TopicTags;
