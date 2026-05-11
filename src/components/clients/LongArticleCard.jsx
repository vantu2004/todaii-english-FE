import { Link } from "react-router-dom";
import { Eye, Clock, ArrowUpRight } from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";
import ToggleBookmarkButton from "./ToggleBookmarkButton";
import { isSavedArticle } from "@/api/clients/articleApi";
import { toggleSavedArticle } from "@/api/clients/userApi";

const LongArticleCard = ({
  id,
  image_url,
  title,
  cefr_level,
  description,
  source_name,
  views,
  published_at,
  updated_at,
}) => {
  const getLevelStyle = (level) => {
    const styles = {
      A1: "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-500/20",
      A2: "bg-teal-50 text-teal-700 ring-teal-600/10 dark:bg-teal-900/30 dark:text-teal-400 dark:ring-teal-500/20",
      B1: "bg-sky-50 text-sky-700 ring-sky-600/10 dark:bg-sky-900/30 dark:text-sky-400 dark:ring-sky-500/20",
      B2: "bg-indigo-50 text-indigo-700 ring-indigo-600/10 dark:bg-indigo-900/30 dark:text-indigo-400 dark:ring-indigo-500/20",
      C1: "bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-900/30 dark:text-violet-400 dark:ring-violet-500/20",
      C2: "bg-purple-50 text-purple-700 ring-purple-600/10 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-500/20",
    };
    return (
      styles[level] ||
      "bg-neutral-100 text-neutral-600 ring-neutral-500/10 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700"
    );
  };

  return (
    <div className="group block bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] dark:hover:shadow-none overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-56 lg:w-64 flex-shrink-0 overflow-hidden">
          <div className="aspect-[16/10] sm:aspect-auto sm:h-full">
            <img
              src={image_url || null}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Source badge on image */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {source_name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col">
          {/* Top row: Level + Date */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ring-1 ring-inset ${getLevelStyle(
                cefr_level,
              )}`}
            >
              {cefr_level || "B1"}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
              <Clock size={12} />
              {formatISODate(updated_at || published_at)}
            </span>
            <div className="ml-auto">
              <ToggleBookmarkButton
                itemId={id}
                checkSavedFn={isSavedArticle}
                toggleSavedFn={toggleSavedArticle}
              />
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/client/article/${id}`}
            className="text-lg font-semibold text-neutral-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-500 leading-snug line-clamp-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors mb-2"
          >
            {title}
          </Link>

          {/* Description */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>

          {/* Bottom row */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Eye size={14} />
                {views?.toLocaleString() || 0} lượt xem
              </span>
            </div>

            {/* Read more indicator */}
            <span className="flex items-center gap-1 text-xs font-medium text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              Đọc tiếp
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongArticleCard;
