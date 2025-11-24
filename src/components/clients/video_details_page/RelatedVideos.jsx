import { Link } from "react-router-dom";
import { formatISODate } from "../../../utils/FormatDate";
import { PlayCircle, Clapperboard, Eye, Calendar } from "lucide-react";

const RelatedVideos = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  // Helper format số view (1000 -> 1K)
  const formatViews = (num) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);

  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header: Clean & Minimal (Đồng bộ với LyricsPanel) */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-2 sticky top-0 z-10">
        <div className="p-2 bg-white rounded-xl border border-neutral-100 shadow-sm text-neutral-700">
          <Clapperboard size={20} />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
          Video tiếp theo
        </h2>
      </div>

      {/* List Content */}
      <div className="p-4 flex flex-col gap-4">
        {videos.map((video) => (
          <Link
            to={`/client/video/${video.id}`}
            key={video.id}
            className="group flex gap-3 items-start cursor-pointer"
          >
            {/* Thumbnail Container */}
            <div className="relative w-36 flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* CEFR Badge Overlay */}
              <div className="absolute bottom-1 right-1">
                <span className="bg-black/70 backdrop-blur-[2px] text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10 shadow-sm">
                  {video.cefr_level}
                </span>
              </div>

              {/* Hover Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 shadow-lg">
                  <PlayCircle
                    size={20}
                    className="text-white drop-shadow-md"
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>

            {/* Info Container */}
            <div className="flex flex-col flex-1 min-w-0 py-0.5">
              <h4
                className="text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-purple-700 transition-colors mb-1"
                title={video.title}
              >
                {video.title}
              </h4>

              <p className="text-xs text-neutral-500 font-medium truncate hover:text-neutral-800 mb-1">
                {video.author_name}
              </p>

              <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-medium mt-auto">
                <div className="flex items-center gap-0.5">
                  <Eye size={10} />
                  <span>{formatViews(video.views)}</span>
                </div>
                <span className="w-0.5 h-0.5 rounded-full bg-neutral-300" />
                <div className="flex items-center gap-0.5">
                  {/* <Calendar size={10} /> */}
                  <span>{formatISODate(video.created_at)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideos;
