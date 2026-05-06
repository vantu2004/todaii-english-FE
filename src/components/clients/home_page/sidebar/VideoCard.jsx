import React from "react";

const VideoCard = ({videoURL, title, duration, views}) => {
  return (
    <div className="group block cursor-pointer">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3">
        <img
          src={videoURL}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt="Video thumbnail"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium rounded">
          {duration}
        </div>
      </div>
      <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors mb-1">
        {title}
      </p>
      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{views} lượt xem</span>
    </div>
  );
};

export default VideoCard;
