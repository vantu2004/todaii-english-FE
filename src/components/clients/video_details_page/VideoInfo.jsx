import { useState } from "react";
// Các icon không dùng đến trong data hiện tại mình tạm ẩn để code gọn,
// bạn có thể uncomment nếu muốn dùng lại.
// import { ThumbsUp, Share2, MoreHorizontal, Download } from "lucide-react";

const VideoInfo = ({ video }) => {
  // Thêm state để tránh lỗi undefined khi click, dù hiện tại chưa có text description
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 pb-6 border-b border-gray-100">
      {/* 1. Title Section - Ưu tiên hiển thị rõ ràng */}
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-3">
        {video.title}
      </h1>

      {/* 2. Author & Stats Container */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: Author Info */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full ring-2 ring-transparent group-hover:ring-gray-200 transition-all overflow-hidden flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${video.author_name}&background=random&color=fff`}
              alt={video.author_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {video.author_name}
            </h3>
          </div>
        </div>
      </div>

      <div
        className={`mt-4 bg-gray-100/70 hover:bg-gray-100 rounded-xl p-3 transition-all duration-200 cursor-pointer ${
          isDescriptionExpanded ? "bg-gray-100" : ""
        }`}
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-medium text-gray-700">
          {/* Views */}
          <span className="text-gray-900 font-semibold">
            {new Intl.NumberFormat("en-US", { notation: "compact" }).format(
              video.views || 0
            )}{" "}
            lượt xem
          </span>

          <span className="text-gray-400">•</span>

          <span className="text-gray-600">
            {new Date(video.created_at).toLocaleDateString("vi-VN")}
          </span>

          {/* CEFR Badge - Làm nổi bật level */}
          <span className="ml-auto sm:ml-2 px-2.5 py-0.5 bg-gray-800 text-white rounded-md text-xs font-bold shadow-sm tracking-wide">
            {video.cefr_level}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
