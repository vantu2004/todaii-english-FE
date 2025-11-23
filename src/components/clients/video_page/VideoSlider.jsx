import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoCard from "./VideoCard";

const VideoSlider = ({ title, videos, onVideoClick }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Scroll khoảng 80% chiều rộng khung nhìn
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-6 md:px-12 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <a
            href="#"
            className="text-xs text-gray-500 hover:text-purple-400 mt-1 flex items-center"
          >
            Xem toàn bộ <ChevronRight size={10} />
          </a>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Container Slider */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {videos.map((video) => (
          // w-[calc(20%-16px)] để hiển thị khoảng 5 items trên màn hình lớn
          // min-w-[200px] để đảm bảo không bị nhỏ quá trên mobile
          <div
            key={video.id}
            className="snap-start flex-shrink-0 w-[200px] md:w-[calc(20%-13px)]"
          >
            <VideoCard video={video} onClick={onVideoClick} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoSlider;
