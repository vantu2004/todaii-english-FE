const Pagination = ({ query, updateQuery, pagination }) => {
  // Hàm tiện ích để tính toán các số trang cần hiển thị (Giới hạn 5 trang)
  const getPageRange = (currentPage, totalPages, maxPages = 5) => {
    // ... (Giữ nguyên logic này)
    const pages = [];
    const half = Math.floor(maxPages / 2);

    let startPage = currentPage - half;
    let endPage = currentPage + half;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, maxPages);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbersToShow = getPageRange(query.page, pagination.totalPages);

  // Class CSS cho các nút chung (custom)
  const baseButtonClasses =
    "px-3 py-1 text-sm leading-4 focus:outline-none transition-colors duration-150 border border-gray-300 dark:border-gray-600";
  const disabledButtonClasses =
    "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500";
  const activeButtonClasses =
    "text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700";
  const normalButtonClasses =
    "text-blue-700 bg-white hover:bg-blue-100 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700";

  return (
    <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
      {/* Show total records */}
      <span className="flex items-center col-span-3">
        {pagination.totalElements > 0
          ? `Showing ${(query.page - 1) * query.size + 1} - ${Math.min(
              query.page * query.size,
              pagination.totalElements
            )} of ${pagination.totalElements}`
          : "No records to display"}
      </span>

      <span className="col-span-2"></span>
      {/* Pagination */}
      <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
        <nav aria-label="Table navigation">
          <ul className="inline-flex items-center space-x-0">
            {/* 1. First Page (Trang đầu) */}
            <li>
              <button
                onClick={() => updateQuery({ ...query, page: 1 })}
                disabled={pagination.first}
                className={`rounded-l-lg ${baseButtonClasses} ${
                  pagination.first
                    ? disabledButtonClasses
                    : normalButtonClasses +
                      " hover:text-blue-800 dark:hover:text-blue-400"
                }`}
                aria-label="First"
              >
                « First
              </button>
            </li>

            {/* 2. Previous Page (Trước) */}
            <li>
              <button
                onClick={() =>
                  query.page > 1 &&
                  updateQuery({ ...query, page: query.page - 1 })
                }
                disabled={pagination.first}
                className={`${baseButtonClasses} ${
                  pagination.first
                    ? disabledButtonClasses
                    : normalButtonClasses +
                      " hover:text-blue-800 dark:hover:text-blue-400"
                }`}
                aria-label="Previous"
              >
                &lt;
              </button>
            </li>

            {/* 3. Page numbers (Các trang) */}
            {pageNumbersToShow.map((pageNum) => (
              <li key={pageNum}>
                <button
                  onClick={() => updateQuery({ ...query, page: pageNum })}
                  // Loại bỏ border cho các nút ở giữa để liền mạch hơn
                  className={`${baseButtonClasses} ${
                    query.page === pageNum
                      ? activeButtonClasses +
                        " border-blue-600 dark:border-blue-600"
                      : normalButtonClasses
                  } border-l-0 dark:border-l-0`}
                >
                  {pageNum}
                </button>
              </li>
            ))}

            {/* 4. Next Page (Tiếp) */}
            <li>
              <button
                onClick={() =>
                  query.page < pagination.totalPages &&
                  updateQuery({ ...query, page: query.page + 1 })
                }
                disabled={pagination.last}
                className={`${baseButtonClasses} border-l-0 dark:border-l-0 ${
                  pagination.last
                    ? disabledButtonClasses
                    : normalButtonClasses +
                      " hover:text-blue-800 dark:hover:text-blue-400"
                }`}
                aria-label="Next"
              >
                &gt;
              </button>
            </li>

            {/* 5. Last Page (Trang cuối) */}
            <li>
              <button
                onClick={() =>
                  updateQuery({ ...query, page: pagination.totalPages })
                }
                disabled={pagination.last}
                className={`rounded-r-lg ${baseButtonClasses} border-l-0 dark:border-l-0 ${
                  pagination.last
                    ? disabledButtonClasses
                    : normalButtonClasses +
                      " hover:text-blue-800 dark:hover:text-blue-400"
                }`}
                aria-label="Last"
              >
                Last »
              </button>
            </li>
          </ul>
        </nav>
      </span>
    </div>
  );
};

export default Pagination;
