import { Search, Loader2 } from "lucide-react";

const SearchHeader = ({
  searchTerm,
  onSearchChange,
  apiSource,
  onSourceChange,
  isLoading,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Input Field */}
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          autoFocus
          value={searchTerm}
          placeholder="Nhập từ vựng cần tra cứu..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-12 py-2 border border-neutral-200 dark:border-neutral-800 
             rounded-md bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white
             placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-brand-500 
             focus:ring-2 focus:ring-brand-500/20 transition-all text-sm shadow-sm"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-neutral-400 dark:text-neutral-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Segmented Control Toggle */}
      <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md">
        <button
          onClick={() => onSourceChange("free")}
          className={`flex-1 sm:flex-none px-6 py-1.5 text-sm font-semibold rounded-md transition-all ${
            apiSource === "free"
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          Free API
        </button>
        <button
          onClick={() => onSourceChange("todaii")}
          className={`flex-1 sm:flex-none px-6 py-1.5 text-sm font-semibold rounded-md transition-all ${
            apiSource === "todaii"
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
              : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          Todaii API
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
