import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
import { PlayCircle, Sparkles, Eye } from "lucide-react";
import { getRecommendedVideos } from "@/api/clients/videoApi";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import { getProgress } from "@/api/clients/progressApi";

const RecommendedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useClientAuthContext();
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const response = await getRecommendedVideos();
        setVideos(response || []);
      } catch (error) {
        console.error("Error fetching recommended videos in sidebar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  useEffect(() => {
    if (isLoggedIn && videos && videos.length > 0) {
      videos.forEach((video) => {
        getProgress(video.id, "VIDEO")
          .then((data) => {
            if (data && data.study_time > 0) {
              setProgressMap((prev) => ({ ...prev, [video.id]: data }));
            }
          })
          .catch((err) =>
            console.error("Error fetching recommended video progress:", err),
          );
      });
    }
  }, [videos, isLoggedIn]);

  if (loading || !videos || videos.length === 0) return null;

  // Helper format số view (1000 -> 1K)
  const formatViews = (num) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);

  return (
    <div className="bg-white dark:bg-neutral-900/60 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-3 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-brand-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-tight">
            Gợi ý dành riêng cho bạn
          </h2>
        </div>
        <span className="flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
        </span>
      </div>

      {/* List Content */}
      <div className="p-3 flex flex-col gap-3">
        {videos.slice(0, 3).map((video) => (
          <Link
            to={`/client/video/${video.id}`}
            key={video.id}
            className="group flex gap-3 items-start cursor-pointer"
          >
            {/* Thumbnail Container */}
            <div className="relative w-36 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                loading="lazy"
              />

              {/* CEFR Badge Overlay */}
              <div className="absolute bottom-1 right-1">
                <span className="bg-black/70 backdrop-blur-[2px] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-sm border border-white/10 shadow-sm">
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
                className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-500 transition-colors mb-1"
                title={video.title}
              >
                {video.title}
              </h4>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate hover:text-neutral-800 dark:hover:text-neutral-200 mb-1">
                {video.author_name}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 mt-auto flex-wrap">
                <div className="flex items-center gap-0.5">
                  <Eye size={10} />
                  <span>{formatViews(video.views)}</span>
                </div>
                <span className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                <div className="flex items-center gap-0.5">
                  <span>{formatISODate(video.created_at)}</span>
                </div>
                {progressMap[video.id] && (
                  <>
                    <span className="w-0.5 h-0.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    <span
                      className={`font-semibold text-[9px] px-1 rounded-sm border
                      ${
                        progressMap[video.id].completed
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/50"
                          : "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 border-brand-200/50 dark:border-brand-900/50"
                      }`}
                    >
                      {progressMap[video.id].completed
                        ? "Đã xem"
                        : `Xem tiếp (${Math.min(
                            100,
                            Math.round(
                              (progressMap[video.id].study_time /
                                progressMap[video.id].estimate_time) *
                                100,
                            ),
                          )}%)`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedVideos;
