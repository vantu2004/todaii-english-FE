import { Clock } from "lucide-react";

export default function LyricLine({
  line,
  isActive,
  onClick,
  lyricRef,
  showEn,
  showVi,
}) {
  // Helper format thời gian (ms -> mm:ss)
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={lyricRef}
      onClick={onClick}
      className={`
        group relative flex gap-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border-l-4
        ${
          isActive
            ? "bg-neutral-100 dark:bg-neutral-800/50 border-neutral-900 dark:border-neutral-400 shadow-sm"
            : "bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/30 hover:border-neutral-200 dark:hover:border-neutral-700"
        }
      `}
    >
      {/* Timestamp Badge */}
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={`
          flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors
          ${
            isActive
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400"
          }
        `}
        >
          <Clock size={10} />
          {formatTime(line.start_ms)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {showEn && (
          <p
            className={`text-base leading-snug mb-1 transition-colors ${
              isActive
                ? "font-bold text-neutral-900 dark:text-neutral-100"
                : "font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white"
            }`}
          >
            {line.text_en}
          </p>
        )}

        {showVi && line.text_vi && (
          <p
            className={`text-sm leading-relaxed italic transition-colors ${
              isActive
                ? "text-neutral-600 dark:text-neutral-400"
                : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-500 dark:group-hover:text-neutral-300"
            }`}
          >
            {line.text_vi}
          </p>
        )}
      </div>
    </div>
  );
}
