import React from "react";
import { Link } from "react-router-dom";
import { Eye, Clock, ArrowUpRight } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

const BigArticleCard = ({
  id,
  image_url,
  title,
  source_name,
  published_at,
  updated_at, // Có thể dùng published_at nếu muốn hiển thị ngày đăng
  views,
}) => {
  return (
    <Link
      to={`/client/article/${id}`}
      className="group relative block w-full overflow-hidden rounded-3xl bg-neutral-900 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Background Image with Zoom Effect */}
      <img
        src={image_url}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Top Badge (Optional - e.g. "Featured") */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md border border-white/10 shadow-sm">
          {source_name}
        </span>
      </div>

      {/* Floating Action Icon (Top Right) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
          <ArrowUpRight size={20} />
        </div>
      </div>

      {/* Content Section */}
      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8">
        <div className="max-w-3xl">
          {/* Meta Data */}
          <div className="flex items-center gap-4 text-neutral-300 text-xs sm:text-sm mb-3 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{formatISODate(updated_at || published_at)}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-500" />
            <div className="flex items-center gap-1.5">
              <Eye size={14} />
              <span>{views} lượt xem</span>
            </div>
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
