import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";
import VideoCard from "./VideoCard";

const DateFilterSection = ({ videos, onVideoClick }) => {
  const [selectedDate, setSelectedDate] = useState("2025-11-23");
  const scrollRef = useRef(null);

  // Tạo mảng ngày giả lập
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date("2025-11-23");
    d.setDate(d.getDate() - i);
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  const scrollDays = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-6 md:px-12 py-10 bg-[#0b0c10] border-t border-gray-900">
      {/* Date Controls */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-8 bg-[#15171c] p-2 rounded-lg border border-gray-800">
        {/* Date Input */}
        <div className="relative bg-white text-black rounded px-3 py-2 flex items-center gap-2 min-w-[160px]">
          <span className="text-xs text-gray-500 absolute -top-2 left-2 bg-white px-1">
            Chọn ngày
          </span>
          <span className="text-sm font-bold">
            {formatISODate(selectedDate)}
          </span>
          <Calendar size={16} className="ml-auto text-gray-500" />
        </div>

        <div className="h-6 w-[1px] bg-gray-700 hidden md:block"></div>

        {/* Scrollable Pills */}
        <div className="flex-1 flex items-center gap-2 overflow-hidden">
          <button
            onClick={() => scrollDays("left")}
            className="p-1.5 bg-white text-black rounded-full shadow hover:bg-gray-200"
          >
            <ChevronLeft size={14} />
          </button>

          <div
            ref={scrollRef}
            className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {days.map((day) => {
              const isSelected = selectedDate === day.value;
              return (
                <button
                  key={day.value}
                  onClick={() => setSelectedDate(day.value)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border
                                ${
                                  isSelected
                                    ? "bg-[#111] text-white border-black"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                                }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollDays("right")}
            className="p-1.5 bg-white text-black rounded-full shadow hover:bg-gray-200"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Video Grid for Date */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {videos.slice(0, 10).map((video) => (
          <VideoCard
            key={`date-${video.id}`}
            video={video}
            onClick={onVideoClick}
          />
        ))}
      </div>
    </section>
  );
};

export default DateFilterSection;
