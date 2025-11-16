// src/pages/clients/SearchResults.jsx
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSearchParams, useNavigate } from "react-router-dom";
import LongArticleCard from "../../../components/clients/home_page/LongArticleCard";
import Pagination from "../../../components/clients/Pagination";
import ArticleFilter from "../../../components/clients/search_result_page/ArticleFilter";
import useArticleSearch from "../../../hooks/clients/useArticleSearch";

// Static filter options
const sourceOptions = [
  { value: "", label: "Tất cả" },
  { value: "Business Insider", label: "Business Insider" },
  { value: "BBC", label: "BBC" },
  { value: "CNN", label: "CNN" },
];

const topicOptions = [
  { value: "", label: "Tất cả" },
  { value: "1", label: "Technology" },
  { value: "8", label: "Business" },
  { value: "3", label: "Education" },
];

const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

const sortOptions = [
  { value: "published_at-desc", label: "Mới nhất" },
  { value: "published_at-asc", label: "Cũ nhất" },
  { value: "views-desc", label: "Lượt xem cao" },
  { value: "views-asc", label: "Lượt xem thấp" },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const q = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(q);

  // Query state
  const [query, setQuery] = useState({
    keyword: q,
    sourceName: "",
    cefrLevel: "",
    page: 1,
    size: 5,
  });

  const updateQuery = (values) =>
    setQuery((prev) => ({ ...prev, ...values }));

  // When URL ?q= changes
  useEffect(() => {
    updateQuery({ keyword: q, page: 1 });
    setSearchInput(q);
  }, [q]);

  const {
    results,
    totalResults,
    totalPages,
    loading,
  } = useArticleSearch(query);

  const performSearch = () => {
    navigate(`/client/search?q=${encodeURIComponent(searchInput)}`);
  };

  return (
    <div className="mb-10 min-h-screen bg-[#f9fafc] pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

        {/* LEFT FILTER PANEL */}
        <ArticleFilter
          query={query}
          updateQuery={updateQuery}
          sourceOptions={sourceOptions}
          topicOptions={topicOptions}
          cefrLevels={cefrLevels}
        />

        {/* RIGHT RESULTS */}
        <div className="w-full md:w-3/4 space-y-6">
          {/* 🔍 SEARCH BAR */}
          <div className="flex gap-3">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performSearch()}
              placeholder="Search articles..."
              className="flex-1 px-4 py-2 rounded-xl border"
            />
            <button
              onClick={performSearch}
              className="px-5 py-2 bg-blue-600 text-white rounded-xl"
            >
              Search
            </button>
          </div>

          {/* HEADER */}
          <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row">
            <div>
              <h1 className="text-2xl font-bold">
                Kết quả tìm kiếm cho:{" "}
                <span className="text-blue-600">"{query.keyword}"</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Tìm thấy <b>{totalResults}</b> bài viết
              </p>
            </div>

            {/* SORT */}
            <Select
              className="min-w-[200px]"
              options={sortOptions}
              value={sortOptions.find(
                (o) =>
                  `${query.sortBy}-${query.direction}` === o.value
              )}
              onChange={(s) => {
                const [field, direction] = s.value.split("-");
                updateQuery({ sortBy: field, direction, page: 1 });
              }}
              isSearchable={false}
            />
          </div>

          {/* RESULTS */}
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20 text-xl">
              Không tìm thấy kết quả
            </div>
          ) : (
            <>
              {results.map((a) => (
                <LongArticleCard key={a.id} {...a} />
              ))}

              {totalPages > 1 && (
                <Pagination
                  currentPage={query.page}
                  totalPages={totalPages}
                  onPageChange={(p) => updateQuery({ page: p })}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
