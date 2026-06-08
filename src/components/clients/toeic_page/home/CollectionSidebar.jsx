import React from "react";
import { BookOpen, ChevronRight } from "lucide-react";

const CollectionSidebar = ({
  collections = [],
  selectedCollection = null,
  onSelectCollection,
  onSelectAll,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="w-full lg:w-72 flex-shrink-0">
        {/* Desktop Skeleton */}
        <div className="hidden lg:block bg-white dark:bg-neutral-900/60 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-2.5">
          <div className="h-5 bg-neutral-100 dark:bg-neutral-800 rounded w-1/2 animate-pulse mb-3"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded-md animate-pulse"
            />
          ))}
        </div>

        {/* Mobile Skeleton */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 bg-neutral-100 dark:bg-neutral-800 rounded-md animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white dark:bg-neutral-900/60 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 sticky top-20">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-3 px-1 flex items-center gap-2">
          <BookOpen className="text-brand-500" size={18} />
          Bộ Đề Thi
        </h2>

        <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
          <button
            onClick={onSelectAll}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 ${
              selectedCollection === null
                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white font-medium"
            }`}
          >
            <span className="truncate text-sm">Tất cả đề thi</span>
            {selectedCollection === null && <ChevronRight size={14} />}
          </button>

          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onSelectCollection(collection)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 ${
                selectedCollection?.id === collection.id
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white font-medium"
              }`}
            >
              <span className="truncate text-sm">{collection.name}</span>
              {selectedCollection?.id === collection.id && (
                <ChevronRight size={14} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Scroll Tabs */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 px-1 scrollbar-hide">
        <button
          onClick={onSelectAll}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all shrink-0 ${
            selectedCollection === null
              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm"
              : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          }`}
        >
          Tất cả đề thi
        </button>

        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => onSelectCollection(collection)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all shrink-0 ${
              selectedCollection?.id === collection.id
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-sm"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            {collection.name}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default CollectionSidebar;
