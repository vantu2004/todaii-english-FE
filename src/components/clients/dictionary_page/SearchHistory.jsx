import { History, X } from "lucide-react";

const SearchHistory = ({
  history,
  onHistoryClick,
  onRemoveItem,
  onClearAll,
}) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <History className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Gần đây</h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-neutral-400 hover:text-red-500 transition-colors"
        >
          Xóa hết
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((word, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-1.5 px-3 py-1 bg-neutral-50 dark:bg-neutral-800/40 
              border border-neutral-200 dark:border-neutral-750 rounded-md hover:border-brand-500 
              dark:hover:border-brand-500 transition-all"
          >
            <button
              onClick={() => onHistoryClick(word)}
              className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-brand-500 
                dark:hover:text-brand-400 font-semibold"
            >
              {word}
            </button>
            <button
              onClick={() => onRemoveItem(word)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 
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
