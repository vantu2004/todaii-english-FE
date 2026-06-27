import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const ResultHeader = ({ test, session, incorrectCount = 0 }) => {
  const partsDone = session?.parts_done
    ? session.parts_done
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  const handleRedoIncorrect = () => {
    toast.success("Tính năng luyện lại câu sai đang được phát triển!");
  };

  return (
    <div className="space-y-2">
      {/* Back Link */}
      <Link
        to={`/client/toeic/${test?.id}`}
        className="inline-flex items-center gap-1 text-brand-500 dark:text-brand-400 hover:underline transition-colors font-semibold text-xs"
      >
        <ArrowLeft size={13} />
        <span>Quay về trang đề thi</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
        <div className="space-y-1">
          <h1 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white leading-tight">
            Kết quả luyện tập: {test?.title || "Đề thi TOEIC"}
          </h1>

          {/* Completed Parts Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase">
              Phần đã làm:
            </span>
            {partsDone.length > 0 ? (
              partsDone.map((part) => (
                <span
                  key={part}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-white border border-brand-600"
                >
                  Part {part}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold italic">
                Không xác định
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/client/toeic/result-detail/${session?.id}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-semibold text-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all border border-neutral-950 dark:border-white cursor-pointer"
          >
            <Eye size={13} />
            <span>Xem chi tiết đáp án</span>
          </Link>

          {/* <button
            type="button"
            onClick={handleRedoIncorrect}
            disabled={incorrectCount === 0}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-semibold text-xs transition-all border ${incorrectCount > 0
              ? "border-rose-300 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400 hover:bg-rose-100/80 cursor-pointer"
              : "border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500 bg-neutral-100/50 dark:bg-neutral-800/30 cursor-not-allowed"
              }`}
          >
            <RefreshCw size={13} />
            <span>Làm lại câu sai ({incorrectCount})</span>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ResultHeader;
