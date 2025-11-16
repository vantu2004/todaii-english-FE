import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="mb-4">
      {/* TITLE */}
      <div className="mb-4 font-semibold text-2xl text-gray-700">
        Tìm đọc tin tức theo ngày
      </div>

      {/* DATE PICKER + SCROLLER */}
      <div className="flex items-center gap-5 h-20">
        {/* SCROLL LEFT */}
        <button
          className="p-2 hover:bg-blue-500 rounded-full transition-colors bg-white shadow-sm"
          onClick={scrollLeft}
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* DATE LIST */}
        <div
          id="date-scroll"
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth w-full max-w-[350px]"
        >
          {getLastNDays(30).map((date, i) => {
            const isActive = formatDate(selectedDate) === formatDate(date);
            return (
              <button
                key={i}
                className={`px-4 py-2 rounded border border-gray-300 font-medium flex-shrink-0 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
                onClick={() => setSelectedDate(date)}
              >
                {formatDisplayDate(date)}
              </button>
            );
          })}
        </div>

        {/* SCROLL RIGHT */}
        <button
          className="p-2 hover:bg-blue-500 rounded-full transition-colors bg-white shadow-sm"
          onClick={scrollRight}
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>

        {/* MANUAL DATE PICKER */}
        <div className="ml-3">
          <BasicDatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </div>

      {/* ARTICLES LIST */}
      <div className="space-y-8 mb-10 mt-6">
        {articlesByDate?.length > 0 ? (
          articlesByDate.map((article) => (
            <LongArticleCard
              key={article.id}
              imgURL={article.image_url}
              title={article.title}
              description={article.paragraphs?.[0]?.text_en}
              cefr_level={article.cefr_level}
              source={article.source_name}
              updated_at={article.updated_at}
              published_at={article.published_at}
              views={article.views}
            />
          ))
        ) : (
          <p className="text-gray-500">Không có bài báo nào trong ngày này.</p>
        )}

        {hasMore && (
          <div className="text-center mt-8 mb-4">
            <button
              className="px-4 py-2 rounded bg-blue-600 font-medium text-white hover:bg-blue-700 transition"
              onClick={loadMoreArticles}
              disabled={loading}
            >
              {loading ? "Đang tải..." : "Xem thêm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesByDate;
