import { Play } from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";
import { Link } from "react-router-dom";
import { isSavedVideo } from "@/api/clients/videoApi";
import { toggleSavedVideo } from "@/api/clients/userApi";
import ToggleBookmarkButton from "@/components/clients/ToggleBookmarkButton";

const VideoCard = ({ video }) => {
  return (
    <Link
      to={`/client/video/${video.id}`}
      className="group cursor-pointer w-full flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 transition-all duration-300">
        <img
          src={video.thumbnail_url} // Entity Java field
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
        />

        {/* Overlay Play Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-500 shadow-sm transition-transform duration-300">
            <Play fill="currentColor" size={16} className="ml-0.5" />
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm text-white shadow-sm 
            ${
              video.cefr_level === "A1" || video.cefr_level === "A2"
                ? "bg-green-500"
                : video.cefr_level === "B1" || video.cefr_level === "B2"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          >
            {video.cefr_level}
          </span>
        </div>

        {/* Bookmark Button */}
        <div className="absolute top-2 right-2 z-10">
          <ToggleBookmarkButton
            itemId={video.id}
            checkSavedFn={isSavedVideo}
            toggleSavedFn={toggleSavedVideo}
          />
        </div>

        {/* Duration/Views Badge (Optional position) */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm backdrop-blur-[2px]">
          {new Intl.NumberFormat("en", { notation: "compact" }).format(
            video.views,
          )}{" "}
          views
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 flex-1 flex flex-col">
        <h4
          className="text-neutral-900 dark:text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors mb-1"
          title={video.title}
        >
          {video.title}
        </h4>
        <div className="mt-auto">
          <p className="text-neutral-500 dark:text-neutral-400 text-xs font-medium truncate hover:text-neutral-700 dark:hover:text-neutral-300">
            {video.author_name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-sm border border-neutral-200 dark:border-neutral-700">
              {formatISODate(video.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
