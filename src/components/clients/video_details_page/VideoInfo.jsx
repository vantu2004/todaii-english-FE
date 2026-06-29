import { formatISODate } from "@/utils/FormatDate";
import { isSavedVideo } from "@/api/clients/videoApi";
import { toggleSavedVideo } from "@/api/clients/userApi";
import ToggleBookmarkButton from "@/components/clients/ToggleBookmarkButton";
import { useNavigate } from "react-router-dom";

const VideoInfo = ({ video }) => {
  const navigate = useNavigate();

  const handleNavigate = (keyword, alias, cefrLevel) => {
    if (keyword) {
      navigate(`/client/video/filter?q=${encodeURIComponent(keyword)}`);
    } else if (alias) {
      navigate(`/client/video/filter?alias=${encodeURIComponent(alias)}`);
    } else if (cefrLevel) {
      navigate(
        `/client/video/filter?cefr_level=${encodeURIComponent(cefrLevel)}`,
      );
    } else {
      navigate(`/client/video/filter`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 px-2 sm:px-0">
      <h1 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-white leading-snug mb-3">
        {video.title}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        {/* Left: Author Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src={
                video.thumbnail_url ||
                `https://ui-avatars.com/api/?name=${video.author_name}&background=random&color=fff`
              }
              alt={video.author_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3
              onClick={() => handleNavigate(video.author_name, null, null)}
              className="text-sm font-semibold text-neutral-900 dark:text-white cursor-pointer hover:text-brand-500 transition-colors truncate"
            >
              {video.author_name}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {video.provider_name || "YouTube"}
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <ToggleBookmarkButton
            itemId={video.id}
            checkSavedFn={isSavedVideo}
            toggleSavedFn={toggleSavedVideo}
          />
        </div>
      </div>
      {/* 3. DESCRIPTION / STATS BOX */}
      <div className="mt-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg p-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 w-full">
            <span className="font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
              {video.views} lượt xem
            </span>

            <span className="text-neutral-400 dark:text-neutral-500 text-xs hidden sm:inline">
              •
            </span>

            <span className="whitespace-nowrap">
              {formatISODate(video.created_at)}
            </span>

            {/* Tag Container - Wrap on mobile */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <span
                className="px-2 py-0.5 bg-neutral-900 text-white rounded-sm text-xs font-semibold tracking-wide whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer"
                onClick={() => handleNavigate(null, null, video.cefr_level)}
              >
                {video.cefr_level}
              </span>

              {video.topics &&
                Array.from(video.topics).map((t) => (
                  <span
                    key={t.id}
                    className="text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded-sm border border-neutral-200 dark:border-neutral-700 whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer"
                    onClick={() => handleNavigate(null, t.alias, null)}
                  >
                    #{t.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
