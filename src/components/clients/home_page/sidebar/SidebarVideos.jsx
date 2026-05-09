import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { getLatestVideos } from "../../../../api/clients/videoApi";

const SidebarVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getLatestVideos(5);
        setVideos(data || []);
      } catch (error) {
        console.error("Failed to fetch sidebar videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="w-full aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) return null;

  const [firstVideo, ...restVideos] = videos;

  return (
    <div className="space-y-0">
      {/* First video - Large */}
      <Link to={`/client/video/${firstVideo.id}`} className="group block cursor-pointer">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-neutral-200 dark:bg-neutral-800">
          <img
            src={firstVideo.thumbnail_url}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={firstVideo.title}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 text-white shadow-lg">
              <Play fill="currentColor" size={16} className="ml-0.5" />
            </div>
          </div>
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-brand-500 text-white text-[10px] font-bold rounded shadow-sm">
            {firstVideo.cefr_level}
          </div>
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium rounded">
            {new Intl.NumberFormat("en", { notation: "compact" }).format(firstVideo.views || 0)} views
          </div>
        </div>
        <p className="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors mb-1" title={firstVideo.title}>
          {firstVideo.title}
        </p>
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {firstVideo.author_name}
        </p>
      </Link>

      {/* Rest videos - Small list */}
      {restVideos.length > 0 && (
        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          {restVideos.map((video) => (
            <Link key={video.id} to={`/client/video/${video.id}`} className="group flex gap-3 items-center">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200 dark:bg-neutral-800">
                <img
                  src={video.thumbnail_url}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={video.title}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                   <Play fill="currentColor" size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-1 right-1 px-1 bg-black/70 text-white text-[9px] font-medium rounded">
                  {video.cefr_level}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-900 dark:text-white leading-tight line-clamp-2 group-hover:text-brand-500 transition-colors mb-1" title={video.title}>
                  {video.title}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                  <span className="truncate max-w-[80px]">{video.author_name}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600"></span>
                  <span>{new Intl.NumberFormat("en", { notation: "compact" }).format(video.views || 0)} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarVideos;
