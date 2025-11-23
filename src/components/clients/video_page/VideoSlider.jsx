import React, { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import VideoCard from "./VideoCard";

const VideoSlider = ({ title, videos, onVideoClick }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.75;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Nếu không có video thì không render section này
  if (!videos || videos.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-8 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {title}
          </h3>
          <a
            href="#"
            className="text-sm font-medium text-gray-500 hover:text-purple-600 mt-1 flex items-center transition-colors"
          >
            Xem tất cả <ChevronRightIcon size={14} className="ml-0.5" />
          </a>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory pt-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map((video) => (
          // w-[240px] trên mobile, w-[calc(20%-19px)] trên desktop (5 items/row)
          <div
            key={video.id}
            className="snap-start flex-shrink-0 w-[240px] md:w-[calc(20%-19.2px)]"
          >
            <VideoCard video={video} onClick={onVideoClick} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoSlider;
