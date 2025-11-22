import React from "react";
import { Link } from "react-router-dom";
import { Eye, Clock } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

const ArticleCard = ({
  id,
  image_url,
  title,
  source_name,
  published_at,
  updated_at,
  views,
}) => {
  return (
    <Link
      to={`/client/article/${id}`}
      className="group flex flex-col h-full bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={image_url ? image_url : null}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Source Badge - Glassmorphism */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-white/20 text-neutral-900 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
            {source_name}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Title */}
        <h3 className="text-neutral-900 font-bold text-base sm:text-lg leading-snug line-clamp-2 mb-3 group-hover:text-neutral-700 transition-colors">
          {/* Underline animation effect */}
          <span className="bg-left-bottom bg-gradient-to-r from-neutral-900 to-neutral-900 bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-all duration-300 ease-out pb-0.5">
            {title}
          </span>
        </h3>

        {/* Meta Info Footer (Pushed to bottom) */}
        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{formatISODate(updated_at || published_at)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-400 group-hover:text-neutral-600 transition-colors">
            <Eye size={14} />
            <span>{views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
