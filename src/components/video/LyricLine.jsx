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
      className={`group flex items-start gap-3 p-2.5 rounded-lg border-l-2 cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-neutral-100/50 dark:bg-neutral-800/30 border-neutral-900 dark:border-neutral-400"
          : "bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/10 hover:border-neutral-200 dark:hover:border-neutral-700"
      }`}
    >
      {/* Time Badge */}
      <span
        className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-sm font-semibold whitespace-nowrap self-start ${
          isActive
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
        }`}
      >
        <Clock size={10} />
        {formatTime(line.start_ms)}
      </span>

      {/* Lyrics Texts */}
      <div className="flex-1 min-w-0">
        {showEn && line.text_en && (
          <p
            className={`text-sm leading-relaxed mb-1 transition-colors ${
              isActive
                ? "text-neutral-900 dark:text-white font-semibold"
                : "text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white"
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
