import React from "react";
import { Play } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

const VideoCard = ({ video, onClick }) => {
  return (
    <div
      onClick={() => onClick(video)}
      className="group cursor-pointer w-full flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300">
        <img
          src={video.thumbnail_url} // Entity Java field
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay Play Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-purple-600 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play fill="currentColor" size={20} className="ml-1" />
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-sm 
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

        {/* Duration/Views Badge (Optional position) */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-[2px]">
          {new Intl.NumberFormat("en", { notation: "compact" }).format(
            video.views
          )}{" "}
          views
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 flex-1 flex flex-col">
        <h4
          className="text-gray-900 font-bold text-sm leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors mb-1"
          title={video.title}
        >
          {video.title}
        </h4>
        <div className="mt-auto">
          <p className="text-gray-500 text-xs font-medium truncate hover:text-gray-700">
            {video.author_name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
              {formatISODate(video.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
