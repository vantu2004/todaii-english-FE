import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { formatDate, formatISODate } from "@/utils/FormatDate";
import VideoCard from "./VideoCard";
import BasicDatePicker from "@/components/clients/home_page/BasicDatePicker";

const DateFilterSection = ({
  videos,
  onDateChange,
  onLoadMore,
  hasMore,
  isLoading,
}) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const scrollRef = useRef(null);

  // Tạo danh sách 30 ngày
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      value: formatDate(d),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  const scrollDays = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const handleSelectDate = (dateValue) => {
    // Nếu chọn lại ngày đang active thì không làm gì
    if (selectedDate === dateValue) return;

    setSelectedDate(dateValue);
    if (onDateChange) {
      onDateChange(dateValue);
    }
  };

  return (
    <section className="px-4 md:px-8 py-8 bg-surface-primary dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white border-l-2 border-brand-500 pl-2">
          Video Theo Ngày
        </h3>
      </div>

      {/* Date Controls Bar */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-4 mb-6 bg-white dark:bg-neutral-900 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
        {/* MUI Date Picker (from home page) */}
        <div className="relative z-10 flex-shrink-0 bg-white dark:bg-neutral-900 rounded-lg min-w-[180px] min-h-[60px] flex items-center">
          <BasicDatePicker
            selectedDate={selectedDate}
            setSelectedDate={(dateObj) => {
              const dateStr = formatDate(dateObj);
              handleSelectDate(dateStr);
            }}
          />
        </div>

        <div className="h-8 w-[1px] bg-neutral-200 dark:bg-neutral-700 hidden md:block mx-2"></div>

        {/* Scrollable Date Pills */}
        <div className="flex-1 flex items-center gap-2 overflow-hidden w-full">
          <button
            onClick={() => scrollDays("left")}
            className="p-2 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-brand-500 transition-colors flex-shrink-0"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={scrollRef}
            className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {days.map((day) => {
              const isSelected = selectedDate === day.value;
              return (
                <button
                  key={day.value}
                  onClick={() => handleSelectDate(day.value)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-md text-sm font-medium transition-colors border
                    ${
                      isSelected
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                        : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-brand-200 dark:hover:border-brand-800"
                    }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollDays("right")}
            className="p-2 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-brand-500 transition-colors flex-shrink-0"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Video Grid */}
      {videos.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
            {videos.map((video) => (
              <VideoCard
                key={`date-${video.id}`} // Dùng ID duy nhất để React không warn
                video={video}
              />
            ))}
          </div>

          {/* Load More Button (Pagination) */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={onLoadMore}
                disabled={isLoading}
                className="group px-5 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang tải thêm...
                  </>
                ) : (
                  <>
                    Xem thêm ngày {formatISODate(selectedDate)}
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-neutral-900/50 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700">
          <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg mb-3">
            <Calendar
              size={32}
              className="text-neutral-300 dark:text-neutral-600"
            />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Không có video nào
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Ngày {formatISODate(selectedDate)} chưa có nội dung cập nhật.
          </p>
        </div>
      )}
    </section>
  );
};

export default DateFilterSection;
