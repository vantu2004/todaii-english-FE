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
        <div className="hidden lg:block bg-white dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="h-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-1/2 animate-pulse mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-11 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse"
            />
          ))}
        </div>

        {/* Mobile Skeleton */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 px-1 scrollbar-hide">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-28 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm sticky top-24">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 px-2 flex items-center gap-2">
          <BookOpen className="text-brand-500" size={20} />
          Bộ Đề Thi
        </h2>

        <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
          <button
            onClick={onSelectAll}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
              selectedCollection === null
                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white font-medium"
            }`}
          >
            <span className="truncate">Tất cả đề thi</span>
            {selectedCollection === null && <ChevronRight size={16} />}
          </button>

          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onSelectCollection(collection)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                selectedCollection?.id === collection.id
                  ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white font-medium"
              }`}
            >
              <span className="truncate">{collection.name}</span>
              {selectedCollection?.id === collection.id && (
                <ChevronRight size={16} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Scroll Tabs */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 px-1 scrollbar-hide">
        <button
          onClick={onSelectAll}
          className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all shrink-0 ${
            selectedCollection === null
              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md"
              : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          }`}
        >
          Tất cả đề thi
        </button>

        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => onSelectCollection(collection)}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all shrink-0 ${
              selectedCollection?.id === collection.id
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
