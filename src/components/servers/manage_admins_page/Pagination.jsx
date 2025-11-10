const Pagination = ({ query, updateQuery, pagination }) => {
  return (
    <div class="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
      {/* Show total records */}
      <span className="flex items-center col-span-3">
        {pagination.totalElements > 0
          ? `Showing ${(query.page - 1) * query.size + 1} - ${Math.min(
              query.page * query.size,
              pagination.totalElements
            )} of ${pagination.totalElements}`
          : "No records to display"}
      </span>

      <span class="col-span-2"></span>
      {/* Pagination */}
      <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
        <nav aria-label="Table navigation">
          <ul className="inline-flex items-center">
            {/* Previous */}
            <li>
              <button
                onClick={() =>
                  query.page > 1 &&
                  updateQuery({ ...query, page: query.page - 1 })
                }
                disabled={pagination.first}
                className={`px-3 py-1 rounded-l-md focus:outline-none ${
                  pagination.first
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                aria-label="Previous"
              >
                &lt;
              </button>
            </li>

            {/* Page numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <li key={pageNum}>
                  <button
                    onClick={() => updateQuery({ ...query, page: pageNum })}
                    className={`px-3 py-1 focus:outline-none ${
                      query.page === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                </li>
              )
            )}

            {/* Next */}
            <li>
              <button
                onClick={() =>
                  query.page < pagination.totalPages &&
                  updateQuery({ ...query, page: query.page + 1 })
                }
                disabled={pagination.last}
                className={`px-3 py-1 rounded-r-md focus:outline-none ${
                  pagination.last
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                aria-label="Next"
              >
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      </span>
    </div>
  );
};

export default Pagination;
