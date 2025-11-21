import React from "react";
import { ChevronLeft, ChevronRight, Calendar, BookOpen } from "lucide-react";
import BasicDatePicker from "./BasicDatePicker";
import LongArticleCard from "../../../components/clients/home_page/LongArticleCard";

import {
  formatDate,
  formatDisplayDate,
  getLastNDays,
} from "../../../utils/FormatDate";

const ArticlesByDate = ({
  selectedDate,
  setSelectedDate,
  articlesByDate,
  hasMore,
  loading,
  loadMoreArticles,
}) => {
  const scrollLeft = () => {
    const container = document.getElementById("date-scroll");
    if (container) container.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = document.getElementById("date-scroll");
    if (container) container.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Text Info - Giảm kích thước chữ trên mobile một chút cho cân đối */}
        <p className="text-neutral-500 text-sm">
          Xem lại các bài viết đã xuất bản vào{" "}
          <span className="font-medium text-neutral-700 block sm:inline mt-1 sm:mt-0">
            {formatDisplayDate(selectedDate)}
          </span>
        </p>

        {/* Date Controls Toolbar */}
        {/* Mobile: gap-2, padding nhỏ | Desktop: gap-3, padding lớn hơn */}
        <div className="flex items-center gap-2 sm:gap-3 bg-neutral-50 p-1.5 sm:p-2 rounded-2xl border border-neutral-100 w-full overflow-hidden">
          {/* Custom Date Picker Trigger Wrapper */}
          {/* flex-shrink-0 để đảm bảo nút này không bao giờ bị bóp méo */}
          <div className="relative z-10 flex-shrink-0">
            <BasicDatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              className="bg-white shadow-sm border border-neutral-200 text-neutral-700 hover:bg-neutral-50 h-9 sm:h-10 px-3 sm:px-4"
            />
          </div>

          <div className="h-6 w-px bg-neutral-200 mx-1 hidden sm:block"></div>

          {/* Scroll Left Button - ẨN TRÊN MOBILE (hidden sm:flex) */}
          <button
            onClick={scrollLeft}
            className="hidden sm:flex p-2 bg-white rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm flex-shrink-0 items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Date Scroll List */}
          {/* Thêm mask-image (nếu dùng tailwind plugin) hoặc logic UI để tạo cảm giác danh sách còn dài */}
          <div
            id="date-scroll"
            className="flex-1 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1 items-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {getLastNDays(30).map((date, i) => {
              const isSelected = formatDate(selectedDate) === formatDate(date);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  // Mobile: px-3 py-1.5 text-xs | Desktop: px-4 py-2 text-sm
                  className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
                    isSelected
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {formatDisplayDate(date)}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button - ẨN TRÊN MOBILE (hidden sm:flex) */}
          <button
            onClick={scrollRight}
            className="hidden sm:flex p-2 bg-white rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors shadow-sm flex-shrink-0 items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Content List */}
      <div className="max-w-5xl mx-auto py-8">
        {articlesByDate?.length > 0 ? (
          <div className="space-y-4">
            {articlesByDate.map((article) => (
              <LongArticleCard key={article.id} {...article} />
            ))}
          </div>
        ) : (
          /* Empty State (Styled like SearchResults) */
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-100 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <Calendar size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Không có bài báo nào
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              Chúng tôi không tìm thấy tin tức nào được xuất bản vào ngày{" "}
              <span className="font-medium">
                {formatDisplayDate(selectedDate)}
              </span>
              .
              <br />
              Vui lòng chọn một ngày khác.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMoreArticles}
              disabled={loading}
              className="px-8 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin" />
                  Đang tải...
                </>
              ) : (
                "Xem thêm bài viết cũ hơn"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesByDate;
