import React from "react";
import { Link } from "react-router-dom"; // Giả sử dùng react-router-dom

const RelatedVideos = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {videos.map((video) => (
        <Link
          to={`/video/${video.id}`}
          key={video.id}
          className="flex gap-2 group cursor-pointer"
        >
          {/* Thumbnail */}
          <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">
              10:25
            </span>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h4
              className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors"
              title={video.title}
            >
              {video.title}
            </h4>
            <p className="text-xs text-gray-500 mt-1 hover:text-gray-700">
              {video.author_name}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <span>
                {new Intl.NumberFormat("en", { notation: "compact" }).format(
                  video.views
                )}{" "}
                views
              </span>
              <span>•</span>
              <span>{new Date(video.created_at).getFullYear()}</span>
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded w-fit mt-1 border border-gray-200">
              {video.cefr_level}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedVideos;
