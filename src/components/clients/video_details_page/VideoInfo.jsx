import { formatISODate } from "../../../utils/FormatDate";
import { isSavedVideo } from "../../../api/clients/videoApi";
import { toggleSavedVideo } from "../../../api/clients/userApi";
import ToggleBookmarkButton from "../ToggleBookmarkButton";

const VideoInfo = ({ video }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4 sm:px-0">
      <h1 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug mb-4">
        {video.title}
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        {/* Left: Author Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
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
            <h3 className="text-sm font-bold text-neutral-900 cursor-pointer hover:text-blue-600 transition-colors truncate">
              {video.author_name}
            </h3>
            <p className="text-xs text-neutral-500 truncate">
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
      <div className="mt-4 bg-neutral-100 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-neutral-700 w-full">
            <span className="font-bold text-neutral-900 whitespace-nowrap">
              {video.views} lượt xem
            </span>

            <span className="text-neutral-400 text-xs hidden sm:inline">•</span>

            <span className="whitespace-nowrap">
              {formatISODate(video.created_at)}
            </span>

            {/* Tag Container - Wrap on mobile */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-xs font-bold tracking-wide whitespace-nowrap">
                {video.cefr_level}
              </span>

              {video.topics &&
                Array.from(video.topics).map((t) => (
                  <span
                    key={t.id}
                    className="text-xs text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-200 whitespace-nowrap"
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
