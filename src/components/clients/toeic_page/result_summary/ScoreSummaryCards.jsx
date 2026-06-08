import React from "react";
import {
  CheckCircle2,
  XCircle,
  SkipForward,
  Percent,
  Clock,
  Trophy,
} from "lucide-react";

const ScoreSummaryCards = ({
  correctCount = 0,
  incorrectCount = 0,
  skippedCount = 0,
  totalQuestions = 0,
  elapsedSeconds = 0,
  isFullTest = false,
  scoreL = 0,
  scoreR = 0,
  totalScore = 0,
}) => {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-2.5">
      {/* Listening / Reading / Total score section (only for Full Test) */}
      {isFullTest && (
        <div className="space-y-2">
          <h2 className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Điểm số thi thử (Full Test Score)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* Listening */}
            <div className="bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 rounded-lg p-3 text-center">
              <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                Listening
              </p>
              <div className="text-2xl font-black text-blue-700 dark:text-blue-400">
                {scoreL}
              </div>
              <p className="text-[9px] text-blue-500 dark:text-blue-400 mt-0.5">
                / 495 điểm
              </p>
            </div>

            {/* Reading */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-250 rounded-lg p-3 text-center">
              <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-0.5">
                Reading
              </p>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                {scoreR}
              </div>
              <p className="text-[9px] text-emerald-500 dark:text-emerald-400 mt-0.5">
                / 495 điểm
              </p>
            </div>

            {/* Total */}
            <div className="bg-brand-50/70 dark:bg-brand-950/20 border border-blue-300 dark:border-brand-850 text-brand-900 dark:text-brand-200 rounded-lg p-3 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-bl tracking-wider">
                TOEIC SCORE
              </div>
              <p className="text-[10px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wider mb-0.5">
                Total Score
              </p>
              <div className="text-2xl font-black text-brand-650 dark:text-brand-400">
                {totalScore}
              </div>
              <p className="text-[9px] text-brand-500 dark:text-brand-400 mt-0.5">
                / 990 điểm
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Core Question Statistics */}
      <div className="space-y-2">
        <h2 className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Thống kê kết quả chi tiết
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Result card (correct/total) */}
          <div className="bg-neutral-50/60 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-500 shrink-0">
                <Trophy size={12} />
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase">
                Kết quả
              </span>
            </div>
            <p className="text-base font-extrabold text-neutral-900 dark:text-white">
              {correctCount}{" "}
              <span className="text-[10px] text-neutral-400">
                / {totalQuestions} câu
              </span>
            </p>
          </div>

          {/* Correct Count */}
          <div className="bg-emerald-50/60 border border-emerald-200 dark:bg-emerald-950/15 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 size={12} />
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                Đúng
              </span>
            </div>
            <p className="text-base font-black text-emerald-700 dark:text-emerald-450">
              {correctCount}{" "}
              <span className="text-[10px] text-emerald-500">câu</span>
            </p>
          </div>

          {/* Incorrect Count */}
          <div className="bg-rose-50/60 border border-rose-200 dark:bg-rose-955/15 dark:border-rose-900/30 text-rose-800 dark:text-rose-350 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-450 shrink-0">
                <XCircle size={12} />
              </div>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase">
                Sai
              </span>
            </div>
            <p className="text-base font-black text-rose-700 dark:text-rose-450">
              {incorrectCount}{" "}
              <span className="text-[10px] text-rose-500">câu</span>
            </p>
          </div>

          {/* Skipped Count */}
          <div className="bg-neutral-50/60 border border-gray-300 dark:bg-neutral-800/40 dark:border-neutral-750 text-neutral-600 dark:text-neutral-400 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shrink-0">
                <SkipForward size={12} />
              </div>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase">
                Bỏ qua
              </span>
            </div>
            <p className="text-base font-extrabold text-neutral-700 dark:text-neutral-300">
              {skippedCount}{" "}
              <span className="text-[10px] text-neutral-500">câu</span>
            </p>
          </div>

          {/* Time & Accuracy Container */}
          <div className="col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2.5 lg:gap-0 lg:space-y-2">
            {/* Time spent */}
            <div className="bg-sky-50/60 border border-sky-200 dark:bg-sky-950/10 dark:border-sky-900/30 text-sky-850 dark:text-sky-300 rounded-lg p-2 flex flex-col justify-center">
              <div className="flex items-center gap-1 mb-0.5">
                <Clock size={11} className="text-sky-500" />
                <span className="text-[9px] text-sky-550 dark:text-sky-400 font-bold uppercase">
                  Thời gian
                </span>
              </div>
              <p className="text-xs font-extrabold text-sky-700 dark:text-sky-450">
                {formatTime(elapsedSeconds)}
              </p>
            </div>

            {/* Accuracy rate */}
            <div className="bg-amber-50/60 border border-amber-200 dark:bg-amber-955/15 dark:border-amber-900/30 text-amber-850 dark:text-amber-300 rounded-lg p-2 flex flex-col justify-center">
              <div className="flex items-center gap-1 mb-0.5">
                <Percent size={11} className="text-amber-550 shrink-0" />
                <span className="text-[9px] text-amber-550 dark:text-amber-400 font-bold uppercase">
                  Chính xác
                </span>
              </div>
              <p className="text-xs font-black text-amber-700 dark:text-amber-455">
                {accuracy}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummaryCards;
