import React from "react";
import { Link } from "react-router-dom";
import { Eye, Clock } from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";

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
      className="group flex flex-col h-full bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-350 dark:hover:border-neutral-700 transition-all duration-150"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={image_url ? image_url : null}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
        />

        {/* Source Badge - Glassmorphism */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-0.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-white/20 dark:border-neutral-700/50 text-neutral-900 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded">
            {source_name}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-3.5">
        {/* Title */}
        <h3 className="text-neutral-900 dark:text-white font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
          {/* Underline animation effect */}
          <span className="bg-left-bottom bg-gradient-to-r from-neutral-900 to-neutral-900 dark:from-white dark:to-white bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-all duration-300 ease-out pb-0.5">
            {title}
          </span>
        </h3>

        {/* Meta Info Footer (Pushed to bottom) */}
        <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{formatISODate(updated_at || published_at)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
            <Eye size={14} />
            <span>{views}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
