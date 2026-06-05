import React from "react";
import { Play, ShieldAlert } from "lucide-react";

const FullTestTab = ({
  testId,
  duration = 120,
  onStartSession,
  startingSession = false,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-neutral-50/50 dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          Chế độ thi thử Full Test
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Chế độ thi thử giả lập môi trường phòng thi thực tế với cấu trúc đề
          chuẩn đủ 7 phần (100 câu Nghe và 100 câu Đọc) diễn ra liên tục.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
          <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">
              Thời gian
            </p>
            <p className="text-base font-semibold text-neutral-800 dark:text-neutral-250">
              {duration} phút
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">
              Số câu hỏi
            </p>
            <p className="text-base font-semibold text-neutral-800 dark:text-neutral-250">
              200 câu
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-850 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">
              Thang điểm
            </p>
            <p className="text-base font-semibold text-neutral-800 dark:text-neutral-250">
              990 điểm
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border border-red-100 dark:border-red-950/30 bg-red-50/30 dark:bg-red-950/10 rounded-2xl flex items-start gap-3">
        <ShieldAlert
          className="text-red-550 dark:text-red-400 shrink-0 mt-0.5"
          size={18}
        />
        <p className="text-sm text-neutral-655 dark:text-neutral-450">
          <strong className="text-red-650 dark:text-red-400">Lưu ý:</strong> Chế
          độ thi này sẽ tính thời gian đếm ngược nghiêm ngặt. Đảm bảo bạn có đủ{" "}
          {duration} phút rảnh rỗi và không bị gián đoạn trước khi bấm nút bắt
          đầu làm bài.
        </p>
      </div>

      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
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
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3.5 px-8 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl font-semibold shadow-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {startingSession ? (
            <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white dark:border-neutral-900/30 dark:border-t-neutral-900 rounded-full animate-spin" />
          ) : (
            <Play size={18} className="fill-current" />
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
