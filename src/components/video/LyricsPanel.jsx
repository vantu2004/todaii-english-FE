import { ListMusic, ChevronUp, ChevronDown, Settings2 } from "lucide-react";
import LyricLine from "./LyricLine";
import { useRef, useEffect, useState } from "react";

export default function LyricsPanel({
  lyricLines,
  activeIndex,
  lyricRefs,
  onSeek,
}) {
  const scrollContainerRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(true);
  const [showEn, setShowEn] = useState(true);
  const [showVi, setShowVi] = useState(true);

  // Scroll logic
  useEffect(() => {
    if (
      isExpanded && // Chỉ scroll khi đang mở rộng
      activeIndex >= 0 &&
      lyricRefs.current[activeIndex] &&
      scrollContainerRef.current
    ) {
      const el = lyricRefs.current[activeIndex];
      const container = scrollContainerRef.current;

      const topPos =
        el.offsetTop -
        container.offsetTop -
        container.clientHeight / 2 +
        el.clientHeight / 2;

      container.scrollTo({
        top: topPos,
        behavior: "smooth",
      });
    }
  }, [activeIndex, lyricRefs, isExpanded]);

  return (
    <div
      className={`bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col mb-6 transition-all duration-300 ease-in-out ${
        isExpanded ? "h-[630px]" : "h-auto"
      }`}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10 cursor-pointer lg:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Left: Title & Icon */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-xl border border-neutral-100 shadow-sm text-purple-600">
            <ListMusic size={18} />
          </div>
          <h2 className="text-base font-bold text-neutral-900 tracking-tight">
            Nội dung
          </h2>
          <span className="text-[10px] font-bold text-neutral-400 bg-white px-2 py-0.5 rounded-md border border-neutral-100">
            {lyricLines.length}
          </span>
        </div>

        {/* Right: Controls */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {isExpanded && (
            <div className="flex items-center gap-1 mr-2 bg-white p-1 rounded-lg border border-neutral-100 shadow-sm">
              <button
                onClick={() => setShowEn(!showEn)}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
                  showEn
                    ? "bg-purple-100 text-purple-700"
                    : "text-neutral-400 hover:bg-neutral-50"
                }`}
                title="Hiện/Ẩn tiếng Anh"
              >
                EN
              </button>
              <div className="w-[1px] h-3 bg-neutral-200"></div>
              <button
                onClick={() => setShowVi(!showVi)}
                className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
                  showVi
                    ? "bg-purple-100 text-purple-700"
                    : "text-neutral-400 hover:bg-neutral-50"
                }`}
                title="Hiện/Ẩn tiếng Việt"
              >
                VN
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Scrollable List - Chỉ render hoặc hiển thị khi Expanded */}
      {isExpanded && (
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 custom-scrollbar hover:scroll-auto scroll-smooth"
        >
          <div className="space-y-1">
            {(showEn || showVi) &&
              lyricLines.map((line, idx) => (
                <LyricLine
                  key={line.id || idx}
                  line={line}
                  isActive={idx === activeIndex}
                  lyricRef={(el) => (lyricRefs.current[idx] = el)}
                  onClick={() => onSeek(line.start_ms)}
                  showEn={showEn}
                  showVi={showVi}
                />
              ))}

            {/* Empty state nếu tắt cả 2 ngôn ngữ */}
            {!showEn && !showVi && (
              <div className="text-center text-neutral-400 py-10 text-sm">
                Đã ẩn toàn bộ nội dung text.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
