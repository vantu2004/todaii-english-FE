import { History, X } from "lucide-react";

const SearchHistory = ({
  history,
  onHistoryClick,
  onRemoveItem,
  onClearAll,
}) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="border-b border-gray-100 dark:border-gray-800 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <History className="w-4 h-4" />
          <h3 className="text-sm font-medium">Recent Searches</h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((word, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 
              border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 
              dark:hover:border-gray-600 transition-all"
          >
            <button
              onClick={() => onHistoryClick(word)}
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 
                dark:hover:text-gray-100 font-medium"
            >
              {word}
            </button>
            <button
              onClick={() => onRemoveItem(word)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 
                hover:text-red-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
