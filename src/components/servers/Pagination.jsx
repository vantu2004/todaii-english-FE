import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({ query, updateQuery, pagination }) => {
  const getPageRange = (currentPage, totalPages, maxPages = 5) => {
    const pages = [];
    const half = Math.floor(maxPages / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (endPage - startPage + 1 < maxPages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, maxPages);
      } else {
        startPage = Math.max(1, endPage - maxPages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  const pageNumbersToShow = getPageRange(query.page, pagination.totalPages);
  const startItem = (query.page - 1) * query.size + 1;
  const endItem = Math.min(query.page * query.size, pagination.totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
      {/* Showing Info */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {pagination.totalElements > 0 ? (
          <span>
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {pagination.totalElements}
            </span>{" "}
            results
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">No records found</span>
        )}
      </div>

      {/* Pagination Controls */}
      <nav className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => updateQuery({ ...query, page: 1 })}
          disabled={pagination.first}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Previous */}
        <button
          onClick={() => updateQuery({ ...query, page: query.page - 1 })}
          disabled={pagination.first}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbersToShow.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => updateQuery({ ...query, page: pageNum })}
              className={`min-w-[2.25rem] px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                query.page === pageNum
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => updateQuery({ ...query, page: query.page + 1 })}
          disabled={pagination.last}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => updateQuery({ ...query, page: pagination.totalPages })}
          disabled={pagination.last}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
