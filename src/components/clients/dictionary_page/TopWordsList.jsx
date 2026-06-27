import { useState, useEffect, useCallback } from "react";
import { Flame, RefreshCw } from "lucide-react";
import { getTopWords } from "@/api/clients/dictionaryApi";

const MEDAL_COLORS = [
  "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900", // #1 gold
  "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700", // #2 silver
  "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900", // #3 bronze
];

const TopWordsList = ({ onWordClick }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTopWords = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getTopWords();
      setWords(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopWords();
  }, [fetchTopWords]);

  const maxCount = words.length > 0 ? words[0].count : 1;

  if (loading) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <Flame className="w-4 h-4" />
            <h3 className="text-sm font-semibold">Tra cứu nhiều nhất</h3>
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-9 bg-neutral-100 dark:bg-neutral-800 rounded-md animate-pulse"
              style={{ width: `${100 - i * 12}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <Flame className="w-4 h-4" />
            <h3 className="text-sm font-semibold">Tra cứu nhiều nhất</h3>
          </div>
          <button
            onClick={fetchTopWords}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Thử lại
          </button>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">
          Không tải được dữ liệu.
        </p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="pt-4">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-3">
          <Flame className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Tra cứu nhiều nhất</h3>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 italic">
          Chưa có dữ liệu tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <Flame className="w-4 h-4 text-brand-500 animate-pulse" />
          <h3 className="text-sm font-semibold">Tra cứu nhiều nhất</h3>
        </div>
        <button
          onClick={fetchTopWords}
          className="text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Words list */}
      <div className="space-y-1.5">
        {words.map((item, index) => {
          const percentage = Math.max((item.count / maxCount) * 100, 8);
          const isTop3 = index < 3;

          return (
            <button
              key={item.word}
              onClick={() => onWordClick?.(item.word)}
              className="w-full group flex items-center gap-2.5 px-2.5 py-2 rounded-md
                hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-all text-left"
            >
              {/* Rank badge */}
              <span
                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold border
                  ${isTop3 ? MEDAL_COLORS[index] : "bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-800"}`}
              >
                {index + 1}
              </span>

              {/* Word + progress bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-brand-500 dark:group-hover:text-brand-400 truncate">
                    {item.word}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-500 ml-2 flex-shrink-0 tabular-nums">
                    {item.count}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-md overflow-hidden">
                  <div
                    className={`h-full rounded-md transition-all duration-500 ${
                      isTop3
                        ? "bg-neutral-900 dark:bg-white"
                        : "bg-neutral-300 dark:bg-neutral-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopWordsList;
