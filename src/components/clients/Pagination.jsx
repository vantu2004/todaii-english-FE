import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisiblePages = 5 
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="min-w-[40px] h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots-1" className="px-2 text-neutral-500 dark:text-neutral-500">•••</span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`min-w-[40px] h-10 px-3 rounded-xl border font-medium transition ${
            currentPage === i
              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md"
              : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots-2" className="px-2 text-neutral-500 dark:text-neutral-500">•••</span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="min-w-[40px] h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      {/* First Page Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        title="First page"
      >
        <ChevronsLeft size={18} className="text-neutral-700 dark:text-neutral-300" />
      </button>

      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        title="Previous page"
      >
        <ChevronLeft size={18} className="text-neutral-700 dark:text-neutral-300" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        title="Next page"
      >
        <ChevronRight size={18} className="text-neutral-700 dark:text-neutral-300" />
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className="h-10 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        title="Last page"
      >
        <ChevronsRight size={18} className="text-neutral-700 dark:text-neutral-300" />
      </button>
    </div>
  );
};

export default Pagination;