import { useState, useEffect, useCallback } from "react";
import { Flame, RefreshCw, TrendingUp } from "lucide-react";
import { getTopWords } from "@/api/servers/dictionaryApi";

const MEDAL_COLORS = [
  "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800", // #1 gold
  "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", // #2 silver
  "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800", // #3 bronze
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

  // Skeleton loader
  if (loading) {
    return (
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Flame className="w-4 h-4" />
            <h3 className="text-sm font-medium">Top Searched</h3>
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-9 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
              style={{ width: `${100 - i * 12}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Flame className="w-4 h-4" />
            <h3 className="text-sm font-medium">Top Searched</h3>
          </div>
          <button
            onClick={fetchTopWords}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Retry
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Failed to load data.
        </p>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="pt-6">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3">
          <Flame className="w-4 h-4" />
          <h3 className="text-sm font-medium">Top Searched</h3>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          No search data yet.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Flame className="w-4 h-4" />
          <h3 className="text-sm font-medium">Top Searched</h3>
        </div>
        <button
          onClick={fetchTopWords}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
              className="w-full group flex items-center gap-2.5 px-2.5 py-2 rounded-lg
                hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all text-left"
            >
              {/* Rank badge */}
              <span
                className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-xs font-semibold border
                  ${isTop3 ? MEDAL_COLORS[index] : "bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"}`}
              >
                {index + 1}
              </span>

              {/* Word + progress bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate">
                    {item.word}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0 tabular-nums">
                    {item.count}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTop3
                        ? "bg-gray-900 dark:bg-gray-300"
                        : "bg-gray-300 dark:bg-gray-600"
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
