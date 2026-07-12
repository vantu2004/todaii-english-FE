import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Clock, ArrowUpRight } from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import { getProgress } from "@/api/clients/progressApi";

const BigArticleCard = ({
  id,
  image_url,
  title,
  source_name,
  published_at,
  updated_at, // Có thể dùng published_at nếu muốn hiển thị ngày đăng
  views,
}) => {
  const { isLoggedIn } = useClientAuthContext();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (isLoggedIn && id) {
      getProgress(id, "ARTICLE")
        .then((data) => setProgress(data))
        .catch((err) => console.error("Error loading card progress:", err));
    }
  }, [id, isLoggedIn]);

  const percent = progress
    ? progress.completed
      ? 100
      : progress.estimate_time > 0
        ? Math.min(
            100,
            Math.round((progress.study_time / progress.estimate_time) * 100),
          )
        : 0
    : 0;

  return (
    <Link
      to={`/client/article/${id}`}
      className="group relative block w-full overflow-hidden rounded-lg bg-neutral-900 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] transition-all duration-150"
    >
      {/* Background Image with Zoom Effect */}
      <img
        src={image_url}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 opacity-90"
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Top Badge (Optional - e.g. "Featured") */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/20 text-white backdrop-blur-md border border-white/10 shadow-sm">
          {source_name}
        </span>
      </div>

      {/* Floating Action Icon (Top Right) */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-8 h-8 rounded-md bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
          <ArrowUpRight size={16} />
        </div>
      </div>

      {/* Content Section */}
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6">
        <div className="max-w-3xl">
          {/* Meta Data */}
          <div className="flex items-center gap-4 text-neutral-300 text-xs mb-2.5 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{formatISODate(updated_at || published_at)}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-500" />
            <div className="flex items-center gap-1.5">
              <Eye size={14} />
              <span>{views} lượt xem</span>
            </div>
            {progress && progress.study_time > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-neutral-500" />
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
                  ${
                    progress.completed
                      ? "text-emerald-400 bg-emerald-950/40 border-emerald-900/50"
                      : "text-brand-400 bg-brand-950/40 border-brand-900/50"
                  }`}
                >
                  {progress.completed ? "Đã đọc" : `Đọc tiếp (${percent}%)`}
                </span>
              </>
            )}
          </div>

          {/* Title with Underline Animation */}
          <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-bold leading-tight sm:leading-tight tracking-tight mb-2">
            <span className="bg-left-bottom bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out pb-1">
              {title}
            </span>
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default BigArticleCard;
