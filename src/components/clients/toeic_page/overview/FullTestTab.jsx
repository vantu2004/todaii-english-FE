import React from "react";
import { Play, ShieldAlert } from "lucide-react";

const FullTestTab = ({
  testId,
  duration = 120,
  onStartSession,
  startingSession = false,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-neutral-50/50 dark:bg-neutral-900/40 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-3">
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
          Chế độ thi thử Full Test
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Chế độ thi thử giả lập môi trường phòng thi thực tế với cấu trúc đề
          chuẩn đủ 7 phần (100 câu Nghe và 100 câu Đọc) diễn ra liên tục.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1">
          <div className="bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mb-0.5">
              Thời gian
            </p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-300">
              {duration} phút
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mb-0.5">
              Số câu hỏi
            </p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-300">
              200 câu
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mb-0.5">
              Thang điểm
            </p>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-300">
              990 điểm
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 border border-red-200 dark:border-red-950/30 bg-red-50/30 dark:bg-red-950/10 rounded-lg flex items-start gap-3">
        <ShieldAlert
          className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
          size={16}
        />
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <strong className="text-red-600 dark:text-red-400">Lưu ý:</strong> Chế
          độ thi này sẽ tính thời gian đếm ngược nghiêm ngặt. Đảm bảo bạn có đủ{" "}
          {duration} phút rảnh rỗi và không bị gián đoạn trước khi bấm nút bắt
          đầu làm bài.
        </p>
      </div>

      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
        <button
          type="button"
          disabled={startingSession}
          onClick={() =>
            onStartSession({
              mode: "FULL_TEST",
              parts: [1, 2, 3, 4, 5, 6, 7],
              duration,
            })
          }
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-lg font-semibold shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {startingSession ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-neutral-900/30 dark:border-t-neutral-900 rounded-full animate-spin" />
          ) : (
            <Play size={16} className="fill-current" />
          )}
          <span>
            {startingSession ? "Đang khởi tạo..." : "Bắt đầu thi Full Test"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FullTestTab;
