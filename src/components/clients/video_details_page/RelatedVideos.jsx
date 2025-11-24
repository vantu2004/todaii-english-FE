import { Link } from "react-router-dom";
import { formatISODate } from "../../../utils/FormatDate";
import { PlayCircle } from "lucide-react";

const RelatedVideos = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-neutral-900 text-lg">Tiếp theo</h3>
        <div className="h-px flex-1 bg-neutral-100"></div>
      </div>

      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <Link
            to={`/client/video/${video.id}`}
            key={video.id}
            className="group flex gap-3 items-start cursor-pointer"
          >
            <div className="relative w-40 flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-neutral-100">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              <div className="absolute bottom-1 right-1">
                <span className="bg-black/70 backdrop-blur-[2px] text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10">
                  {video.cefr_level}
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle size={24} className="text-white drop-shadow-lg" />
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0 py-0.5">
              <h4
                className="text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-1"
                title={video.title}
              >
                {video.title}
              </h4>

              <p className="text-xs text-neutral-500 font-medium truncate hover:text-neutral-700 mb-0.5">
                {video.author_name}
              </p>

              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{formatISODate(video.created_at)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;
