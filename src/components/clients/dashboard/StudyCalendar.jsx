import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TvMinimalPlay,
  GraduationCap,
  Award,
  Clock,
  Sparkles,
} from "lucide-react";

const StudyCalendar = ({ logs = [], loading = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  // Format a Date object to YYYY-MM-DD in local time
  const formatDateStr = (year, month, day) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  // Build a lookup map of logs by study_date
  const logsMap = useMemo(() => {
    const map = new Map();
    logs.forEach((log) => {
      // API date might be "YYYY-MM-DD"
      if (log.date) {
        map.set(log.date, log);
      }
    });
    return map;
  }, [logs]);

  // Calendar calculations
  const calendarCells = useMemo(() => {
    // Index of the first day of the month (0 = Mon, 6 = Sun)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const firstDayIndex = (firstDay + 6) % 7;

    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // 1. Prev month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = totalDaysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = formatDateStr(prevYear, prevMonth, day);
      cells.push({
        day,
        dateStr,
        isCurrentMonth: false,
        log: logsMap.get(dateStr) || null,
      });
    }

    // 2. Current month days
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateStr = formatDateStr(currentYear, currentMonth, day);
      cells.push({
        day,
        dateStr,
        isCurrentMonth: true,
        log: logsMap.get(dateStr) || null,
      });
    }

    // 3. Next month padding days to make it exactly 42 cells (6 rows * 7 columns)
    const remaining = 42 - cells.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = formatDateStr(nextYear, nextMonth, day);
      cells.push({
        day,
        dateStr,
        isCurrentMonth: false,
        log: logsMap.get(dateStr) || null,
      });
    }

    return cells;
  }, [currentYear, currentMonth, logsMap]);

  // Summarize stats for the current month being viewed
  const monthlySummary = useMemo(() => {
    let totalMinutes = 0;
    let totalArticles = 0;
    let totalVideos = 0;
    let totalVocab = 0;
    let totalTests = 0;

    calendarCells.forEach((cell) => {
      if (cell.isCurrentMonth && cell.log) {
        totalMinutes += cell.log.total_study_minutes || 0;
        totalArticles += cell.log.articles_read_count || 0;
        totalVideos += cell.log.videos_watched_count || 0;
        totalVocab += cell.log.vocab_decks_learned_count || 0;
        totalTests += cell.log.tests_taken_count || 0;
      }
    });

    return { totalMinutes, totalArticles, totalVideos, totalVocab, totalTests };
  }, [calendarCells]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDayStr(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDayStr(null);
  };

  // Get color for day study time badge
  const getStudyTimeBadgeColor = (mins) => {
    if (!mins) return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
    if (mins < 15) return "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400";
    if (mins < 30) return "bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300";
    return "bg-brand-500 text-white shadow-sm";
  };

  // Format selected date for display
  const selectedLog = selectedDayStr ? logsMap.get(selectedDayStr) : null;
  const formattedSelectedDate = selectedDayStr
    ? new Date(selectedDayStr).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
    : null;

  const todayStr = useMemo(() => {
    const today = new Date();
    return formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  }, []);

  return (
    <div className="space-y-6">
      {/* Calendar Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 sm:p-6 shadow-sm">
        {/* Calendar Header / Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Clock className="text-brand-500 w-4 h-4" />
              Lịch học tập thời khóa biểu
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Hiển thị chi tiết số phút và hoạt động học tập hàng ngày
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 px-3 min-w-[120px] text-center">
              Tháng {currentMonth + 1}, {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400 dark:text-neutral-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mb-3"></div>
            <span className="text-xs">Đang tải lịch học...</span>
          </div>
        ) : (
          <>
            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-semibold text-neutral-400 dark:text-neutral-500">
              <div>Thứ 2</div>
              <div>Thứ 3</div>
              <div>Thứ 4</div>
              <div>Thứ 5</div>
              <div>Thứ 6</div>
              <div>Thứ 7</div>
              <div>Chủ Nhật</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 border border-neutral-100 dark:border-neutral-850 rounded-lg overflow-hidden">
              {calendarCells.map((cell, idx) => {
                const isToday = cell.dateStr === todayStr;
                const isSelected = cell.dateStr === selectedDayStr;
                const hasLog = !!cell.log;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (cell.isCurrentMonth) {
                        setSelectedDayStr(isSelected ? null : cell.dateStr);
                      }
                    }}
                    className={`min-h-[85px] p-2 flex flex-col justify-between border-b border-r border-neutral-100 dark:border-neutral-850/80 transition-all ${cell.isCurrentMonth
                      ? "bg-white dark:bg-neutral-900 cursor-pointer"
                      : "bg-neutral-50/50 dark:bg-neutral-950/20 opacity-40 select-none cursor-default"
                      } ${isToday
                        ? "bg-brand-500/5 dark:bg-brand-500/10 font-bold border-brand-500/30"
                        : ""
                      } ${isSelected
                        ? "ring-2 ring-brand-500 dark:ring-brand-400 z-10"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                      }`}
                  >
                    {/* Day Number and Mins Badge */}
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-xs ${isToday
                          ? "text-brand-500 font-bold"
                          : cell.isCurrentMonth
                            ? "text-neutral-800 dark:text-neutral-200 font-medium"
                            : "text-neutral-400 dark:text-neutral-600"
                          }`}
                      >
                        {cell.day}
                      </span>
                      {hasLog && (
                        <span
                          className={`text-[9px] px-1 py-0.5 rounded font-semibold ${getStudyTimeBadgeColor(
                            cell.log.total_study_minutes
                          )}`}
                        >
                          {cell.log.total_study_minutes}m
                        </span>
                      )}
                    </div>

                    {/* Day Activities Inside Grid */}
                    {hasLog && (
                      <div className="mt-2 space-y-0.5 text-[10px] text-neutral-500 dark:text-neutral-400 leading-none">
                        {cell.log.articles_read_count > 0 && (
                          <div className="flex items-center gap-0.5 truncate">
                            <span>Bài viết đã đọc</span>
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              {cell.log.articles_read_count}
                            </span>
                          </div>
                        )}
                        {cell.log.videos_watched_count > 0 && (
                          <div className="flex items-center gap-0.5 truncate">
                            <span>Video đã xem</span>
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              {cell.log.videos_watched_count}
                            </span>
                          </div>
                        )}
                        {cell.log.vocab_decks_learned_count > 0 && (
                          <div className="flex items-center gap-0.5 truncate">
                            <span>Bộ từ vựng đã học</span>
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              {cell.log.vocab_decks_learned_count}
                            </span>
                          </div>
                        )}
                        {cell.log.tests_taken_count > 0 && (
                          <div className="flex items-center gap-0.5 truncate">
                            <span>Đề thi đã làm</span>
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">
                              {cell.log.tests_taken_count}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Monthly Summary Statistics */}
            <div className="mt-6 pt-5 border-t border-neutral-150 dark:border-neutral-800">
              <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                Tổng hợp hoạt động tháng
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    <Clock size={13} className="text-brand-500" />
                    <span>Thời gian học</span>
                  </div>
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {monthlySummary.totalMinutes}m
                  </span>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    <BookOpen size={13} className="text-blue-500" />
                    <span>Bài báo</span>
                  </div>
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {monthlySummary.totalArticles} bài
                  </span>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    <TvMinimalPlay size={13} className="text-red-500" />
                    <span>Video xem</span>
                  </div>
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {monthlySummary.totalVideos} vid
                  </span>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    <GraduationCap size={13} className="text-purple-500" />
                    <span>Từ vựng</span>
                  </div>
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {monthlySummary.totalVocab} bộ
                  </span>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    <Award size={13} className="text-yellow-500" />
                    <span>Đề thi luyện</span>
                  </div>
                  <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                    {monthlySummary.totalTests} đề
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selected Day Details Panel */}
      {selectedDayStr && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 shadow-sm animate-fade-in">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4 flex justify-between items-center">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Chi tiết ngày học: {formattedSelectedDate}
            </h4>
            <button
              onClick={() => setSelectedDayStr(null)}
              className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              Đóng chi tiết
            </button>
          </div>

          {selectedLog ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-850/40 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <div className="p-2 bg-brand-50 dark:bg-brand-950/20 text-brand-500 rounded-lg">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-500 uppercase font-bold tracking-wider">
                    Tổng thời gian học
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedLog.total_study_minutes || 0} phút
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-850/40 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-lg">
                  <BookOpen size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-500 uppercase font-bold tracking-wider">
                    Bài báo đã đọc
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedLog.articles_read_count || 0} bài viết
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-850/40 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg">
                  <TvMinimalPlay size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-500 uppercase font-bold tracking-wider">
                    Video đã xem
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedLog.videos_watched_count || 0} video
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-850/40 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/20 text-purple-500 rounded-lg">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-500 uppercase font-bold tracking-wider">
                    Từ vựng đã học
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedLog.vocab_decks_learned_count || 0} bộ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50/50 dark:bg-neutral-850/40 rounded-lg border border-neutral-100 dark:border-neutral-800 md:col-span-2 lg:col-span-1">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-500 rounded-lg">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-500 uppercase font-bold tracking-wider">
                    Đề thi đã luyện
                  </p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {selectedLog.tests_taken_count || 0} đề thi
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-neutral-400 dark:text-neutral-500 italic">
              Không có hoạt động học tập nào được ghi lại vào ngày này.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyCalendar;
