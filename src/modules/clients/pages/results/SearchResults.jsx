import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import LongArticleCard from "../../../../components/clients/home_page/LongArticleCard";
import Pagination from "../../../../components/clients/Pagination";
import ArticleFilter from "../../../../components/clients/search_result_page/ArticleFilter";
import useArticleSearch from "../../../../hooks/clients/useArticleSearch";
import SearchBar from "../../../../components/clients/SearchBar";

const sortOptions = [
  { value: "published_at-desc", label: "Mới nhất" },
  { value: "published_at-asc", label: "Cũ nhất" },
  { value: "views-desc", label: "Xem nhiều nhất" },
  { value: "views-asc", label: "Xem ít nhất" },
];

const sourceOptions = [
  { value: "", label: "Tất cả nguồn" },
  { value: "Business Insider", label: "Business Insider" },
  { value: "BBC", label: "BBC" },
  { value: "CNN", label: "CNN" },
];

const topicOptions = [
  { value: "", label: "Tất cả chủ đề" },
  { value: "1", label: "Technology" },
  { value: "8", label: "Business" },
  { value: "3", label: "Education" },
];

const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [query, setQuery] = useState({
    keyword: q,
    sourceName: "",
    topicId: "",
    cefrLevel: "",
    minViews: 0,
    page: 1,
    size: 5,
    sortBy: "publishedAt",
    direction: "desc",
  });

  console.log(query);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const { results, totalResults, totalPages, loading } =
    useArticleSearch(query);

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const currentSort = sortOptions.find(
    (o) => o.value === `${query.sortBy}-${query.direction}`
  );

  return (
    <div className="min-h-screen bg-neutral-100/50  pt-20">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 px-4">
        <div className="max-w-7xl mx-auto py-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-xs font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2">
                Kết quả tìm kiếm
              </p>
              <h1 className="text-2xl sm:text-3xl font-light text-neutral-900 tracking-tight">
                {query.keyword ? (
                  <>
                    Tìm kiếm cho "
                    <span className="font-medium">{query.keyword}</span>"
                  </>
                ) : (
                  "Tất cả bài viết"
                )}
              </h1>
              <p className="mt-2 text-neutral-500 text-sm">
                Tìm thấy{" "}
                <span className="font-medium text-neutral-700">
                  {totalResults}
                </span>{" "}
                bài viết
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full lg:w-96">
              <SearchBar
                value={query.keyword || ""}
                placeholder="Tìm kiếm bài viết..."
                onChangeSearch={(text) => {
                  updateQuery({ keyword: text, page: 1 });
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors"
              >
                <SlidersHorizontal size={16} />
                Bộ lọc
              </button>

              <div className="hidden lg:block" />

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-neutral-400">Sắp xếp:</span>
                  {currentSort?.label || "Mới nhất"}
                  <ChevronDown
                    size={16}
                    className={`text-neutral-400 transition-transform ${
                      showSortDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showSortDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-20">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            const [field, direction] = option.value.split("-");
                            updateQuery({ sortBy: field, direction, page: 1 });
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                            currentSort?.value === option.value
                              ? "bg-neutral-50 text-neutral-900 font-medium"
                              : "text-neutral-600 hover:bg-neutral-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Results List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 animate-pulse"
                  >
                    <div className="flex gap-5">
                      <div className="w-52 h-36 bg-neutral-100 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-neutral-100 rounded w-16" />
                        <div className="h-5 bg-neutral-100 rounded w-3/4" />
                        <div className="h-4 bg-neutral-100 rounded w-full" />
                        <div className="h-4 bg-neutral-100 rounded w-2/3" />
                        <div className="flex gap-4 pt-2">
                          <div className="h-3 bg-neutral-100 rounded w-20" />
                          <div className="h-3 bg-neutral-100 rounded w-16" />
                          <div className="h-3 bg-neutral-100 rounded w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Search size={24} className="text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-neutral-500 text-sm max-w-sm mx-auto">
                  Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((article) => (
                  <LongArticleCard key={article.id} {...article} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-8">
                <Pagination
                  currentPage={query.page}
                  totalPages={totalPages}
                  onPageChange={(p) => updateQuery({ page: p })}
                />
              </div>
            )}
          </div>

          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ArticleFilter
                query={query}
                updateQuery={updateQuery}
                sourceOptions={sourceOptions}
                topicOptions={topicOptions}
                cefrLevels={cefrLevels}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Bộ lọc</h2>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <ArticleFilter
                query={query}
                updateQuery={(values) => {
                  updateQuery(values);
                }}
                sourceOptions={sourceOptions}
                topicOptions={topicOptions}
                cefrLevels={cefrLevels}
                onApply={() => setShowMobileFilter(false)}
                isMobile
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
