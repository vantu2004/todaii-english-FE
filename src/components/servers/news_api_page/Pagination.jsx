import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const Pagination = ({ query, updateQuery, pagination }) => {
  const { page, pageSize } = query;
  const totalPages = pagination.totalPages || 1;
  const totalElements = pagination.totalElements || 0;

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  const getPageRange = (currentPage, totalPages, maxPages = 5) => {
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

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageNumbersToShow = getPageRange(page, totalPages);

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6 py-4 bg-white border-t border-gray-200 rounded-lg">
      {/* Pagination Controls */}
      <nav className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => updateQuery({ page: 1 })}
          disabled={isFirstPage}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4 text-gray-600" />
        </button>

        {/* Previous */}
        <button
          onClick={() => updateQuery({ page: page - 1 })}
          disabled={isFirstPage}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbersToShow.map((num) => (
            <button
              key={num}
              onClick={() => updateQuery({ page: num })}
              className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                page === num
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => updateQuery({ page: page + 1 })}
          disabled={isLastPage}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => updateQuery({ page: totalPages })}
          disabled={isLastPage}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4 text-gray-600" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
