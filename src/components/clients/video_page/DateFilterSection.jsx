import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";
import VideoCard from "./VideoCard";

const DateFilterSection = ({ videos, onVideoClick, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const scrollRef = useRef(null);

  // Tạo danh sách 14 ngày gần nhất
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
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

  const handleSelectDate = (dateValue) => {
    setSelectedDate(dateValue);
    if (onDateChange) {
      onDateChange(dateValue);
    }
  };

  return (
    <section className="px-6 md:px-12 py-12 bg-gray-50 border-t border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 border-l-4 border-purple-600 pl-3">
          Video Theo Ngày
        </h3>
      </div>

      {/* Date Controls Bar */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-8 bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
        {/* Date Display Box */}
        <div className="relative bg-gray-50 text-gray-900 rounded-lg px-4 py-2.5 flex items-center gap-3 min-w-[180px] border border-gray-200">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider absolute -top-2 left-3 bg-white px-1">
            Đang chọn
          </span>
          <Calendar size={18} className="text-purple-600" />
          <span className="text-sm font-bold">
            {formatISODate(selectedDate)}
          </span>
        </div>

        <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-2"></div>

        {/* Scrollable Date Pills */}
        <div className="flex-1 flex items-center gap-2 overflow-hidden w-full">
          <button
            onClick={() => scrollDays("left")}
            className="p-2 bg-white text-gray-600 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-purple-600 transition-colors shadow-sm flex-shrink-0"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={scrollRef}
            className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1"
            style={{ scrollbarWidth: "none" }}
          >
            {days.map((day) => {
              const isSelected = selectedDate === day.value;
              return (
                <button
                  key={day.value}
                  onClick={() => handleSelectDate(day.value)}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all border
                    ${
                      isSelected
                        ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-purple-200"
                    }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollDays("right")}
            className="p-2 bg-white text-gray-600 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-purple-600 transition-colors shadow-sm flex-shrink-0"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Video Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {videos.slice(0, 10).map((video) => (
            <VideoCard
              key={`date-${video.id}`}
              video={video}
              onClick={onVideoClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Không có video nào trong ngày này.
        </div>
      )}

      {/* Show More Button */}
      {videos.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 hover:border-purple-400 hover:text-purple-600 transition-all shadow-sm">
            Xem thêm ngày {formatISODate(selectedDate)}
          </button>
        </div>
      )}
    </section>
  );
};

export default DateFilterSection;
