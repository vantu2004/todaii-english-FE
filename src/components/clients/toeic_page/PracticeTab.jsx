import React, { useMemo, useState } from "react";
import { Play, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const PARTS_METADATA = [
  {
    id: 1,
    name: "Part 1",
    fullName: "Photographs",
    questions: 6,
    type: "listening",
  },
  {
    id: 2,
    name: "Part 2",
    fullName: "Question-Response",
    questions: 25,
    type: "listening",
  },
  {
    id: 3,
    name: "Part 3",
    fullName: "Conversations",
    questions: 39,
    type: "listening",
  },
  {
    id: 4,
    name: "Part 4",
    fullName: "Talks",
    questions: 30,
    type: "listening",
  },
  {
    id: 5,
    name: "Part 5",
    fullName: "Incomplete Sentences",
    questions: 30,
    type: "reading",
  },
  {
    id: 6,
    name: "Part 6",
    fullName: "Text Completion",
    questions: 16,
    type: "reading",
  },
  {
    id: 7,
    name: "Part 7",
    fullName: "Reading Comprehension",
    questions: 54,
    type: "reading",
  },
];

const PracticeTab = ({
  testId,
  tags = [],
  loadingTags = false,
  selectedParts = [],
  onTogglePart,
  onSelectAll,
  onDeselectAll,
  onStartSession,
  startingSession = false,
}) => {
  const [duration, setDuration] = useState(30); // Default to 30 minutes

  // Group tags by part number (supports both snake_case and camelCase)
  const tagsByPart = useMemo(() => {
    const grouped = {};
    tags.forEach((tag) => {
      const partNumStr = tag.part_numbers || tag.partNumbers || "";
      const parts = partNumStr.split(",").map(Number).filter(Boolean);
      parts.forEach((partId) => {
        if (!grouped[partId]) grouped[partId] = [];
        grouped[partId].push(tag);
      });
    });
    return grouped;
  }, [tags]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-4 border border-brand-100 dark:border-brand-900/30 bg-brand-50/30 dark:bg-brand-900/5 rounded-2xl flex items-start gap-3">
        <Sparkles className="text-brand-500 shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <strong className="text-brand-600 dark:text-brand-400">
            Pro tip:
          </strong>{" "}
          Chọn một hoặc nhiều phần thi dưới đây để bắt đầu luyện tập tập trung.
          Tags sẽ giúp bạn định vị chủ đề ngữ pháp/ngữ cảnh.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Chọn phần thi
          </h3>
          <div className="flex gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Chọn tất cả
            </button>
            <span className="text-neutral-200 dark:text-neutral-800">|</span>
            <button
              type="button"
              onClick={onDeselectAll}
              className="text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {PARTS_METADATA.map((part) => {
            const isSelected = selectedParts.includes(part.id);
            const partTags = tagsByPart[part.id] || [];

            return (
              <label
                key={part.id}
                className={`flex items-start gap-3.5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/20 dark:bg-brand-500/5 ring-1 ring-brand-500/30"
                    : "border-neutral-200 dark:border-neutral-800/80 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onTogglePart(part.id)}
                  className="mt-1 w-4.5 h-4.5 text-brand-500 border-neutral-300 dark:border-neutral-700 rounded focus:ring-brand-500/20 dark:bg-neutral-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {part.name}
                    </span>
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md shrink-0">
                      {part.questions} câu
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 truncate">
                    {part.fullName}
                  </p>

                  {/* Tags from BE */}
                  {partTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {partTags.map((tag) => (
                        <span
                          key={tag.id}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/20 dark:border-neutral-700/30"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  ) : loadingTags ? (
                    <div className="flex gap-1.5 animate-pulse">
                      <div className="h-4 w-12 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                      <div className="h-4 w-16 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                    </div>
                  ) : null}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div className="space-y-2 pt-2">
        <label className="block text-sm font-semibold text-neutral-900 dark:text-white">
          Thời gian làm bài
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full sm:w-64 px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-700 dark:text-neutral-350 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        >
          <option value={10}>10 phút</option>
          <option value={20}>20 phút</option>
          <option value={30}>30 phút</option>
          <option value={45}>45 phút</option>
          <option value={60}>60 phút</option>
          <option value={90}>90 phút</option>
          <option value={120}>120 phút</option>
        </select>
      </div>

      {/* Start Button */}
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
        {selectedParts.length === 0 ? (
          <button
            type="button"
            onClick={() => toast.error("Vui lòng chọn ít nhất một phần thi!")}
            className="flex items-center justify-center gap-2 w-full sm:w-auto py-3.5 px-8 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-xl font-bold cursor-not-allowed transition-colors"
          >
            <Play size={18} className="fill-neutral-400 text-neutral-400" />
            <span>Bắt đầu luyện tập</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={startingSession}
            onClick={() =>
              onStartSession({
                mode: "PRACTICE",
                parts: selectedParts,
                duration,
              })
            }
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3.5 px-8 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl font-semibold shadow-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {startingSession ? (
              <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white dark:border-neutral-900/30 dark:border-t-neutral-900 rounded-full animate-spin" />
            ) : (
              <Play size={18} className="fill-current" />
            )}
            <span>
              {startingSession ? "Đang khởi tạo..." : "Bắt đầu luyện tập"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticeTab;
