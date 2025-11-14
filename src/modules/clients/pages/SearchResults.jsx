import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import {
  searchArticles,
  filterArticles,
} from "../../../api/clients/articleApi";
import LongArticleCard from "../../../components/clients/home_page/LongArticleCard";
import toast from "react-hot-toast";
import Pagination from "../../../components/clients/Pagination";

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

const sortArticles = (list, sortBy, sortDirection) => {
  const sorted = [...list];

  if (sortBy === "views") {
    sorted.sort((a, b) =>
      sortDirection === "desc" ? b.views - a.views : a.views - b.views
    );
  } else if (sortBy === "published_at") {
    console.log("Hello");

    sorted.sort((a, b) => {
      console.log(a.updated_at);
      return sortDirection === "desc"
        ? new Date(b.published_at) - new Date(a.published_at)
        : new Date(a.published_at) - new Date(b.published_at);
    });
  }

  return sorted;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState([]);
  const [originalResults, setOriginalResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [sourceName, setSourceName] = useState("");
  const [topicId, setTopicId] = useState("");
  const [cefrLevel, setCefrLevel] = useState("");

  const [sortBy, setSortBy] = useState("published_at");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.trim() === "") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let data;

        if (sourceName || topicId || cefrLevel) {
          data = await filterArticles({
            sourceName,
            topicId,
            cefrLevel,
            minViews: 0,
            page,
            size: 5,
          });
        } else {
          data = await searchArticles(query, page, 1);
        }

        if (data.content) {
          setOriginalResults(data.content);

          // Stored list for sorted
          const sortedList = sortArticles(
            [...data.content],
            sortBy,
            sortDirection
          );

          setResults(sortedList);
          setTotalResults(data.total_elements || 0);
          setTotalPages(data.total_pages || 0);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tìm kiếm. Vui lòng thử lại.");
        toast.error("Không thể tìm kiếm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, page, sourceName, topicId, cefrLevel, sortBy, sortDirection]);

  return (
    <div className="mb-10 min-h-screen bg-[#f9fafc] pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* LEFT FILTER PANEL */}
        <div className="w-full md:w-1/4 bg-white p-5 rounded-2xl shadow-lg space-y-4 sticky top-24 h-fit">
          <h2 className="text-xl font-bold text-gray-800">Bộ lọc</h2>

          {/* Source Filter */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Nguồn
            </label>
            <Select
              options={sourceOptions}
              value={sourceOptions.find((o) => o.value === sourceName)}
              onChange={(selected) =>
                setSourceName(selected ? selected.value : "")
              }
              isClearable
              className="react-select"
            />
          </div>

          {/* Topic Filter */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Chủ đề
            </label>
            <Select
              options={topicOptions}
              value={topicOptions.find((o) => o.value === topicId)}
              onChange={(selected) =>
                setTopicId(selected ? selected.value : "")
              }
              isClearable
              className="react-select"
            />
          </div>

          {/* CEFR Level */}
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              CEFR Level
            </label>
            <div className="space-y-1">
              {cefrLevels.map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                >
                  <input
                    type="radio"
                    name="cefrLevel"
                    value={level}
                    checked={cefrLevel === level}
                    onChange={() => {
                      setCefrLevel(level);
                      setPage(1);
                    }}
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                </label>
              ))}

              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                <input
                  type="radio"
                  name="cefrLevel"
                  value=""
                  checked={cefrLevel === ""}
                  onChange={() => {
                    setCefrLevel("");
                    setPage(1);
                  }}
                />
                <span className="text-sm text-gray-700">Tất cả</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                setSourceName("");
                setTopicId("");
                setCefrLevel("");
                setPage(1);
              }}
              className="flex-1 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
            >
              Reset
            </button>

            <button
              onClick={() => setPage(1)}
              className="flex-1 py-2 text-sm rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Áp dụng
            </button>
          </div>
        </div>

        {/* RIGHT RESULTS PANEL */}
        <div className="w-full md:w-3/4 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Kết quả tìm kiếm cho:{" "}
                <span className="text-blue-600">"{query}"</span>
              </h1>
              <p className="text-gray-600 mt-1">
                Tìm thấy <b>{totalResults}</b> bài viết
              </p>
            </div>

            {/* SORT SELECT */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>

                <div className="min-w-[180px]">
                  <Select
                    options={sortOptions}
                    value={sortOptions.find(
                      (opt) => opt.value === `${sortBy}-${sortDirection}`
                    )}
                    onChange={(selected) => {
                      const [field, direction] = selected.value.split("-");
                      setSortBy(field);
                      setSortDirection(direction);
                      setPage(1);

                      // apply sorting instantly
                      setResults(
                        sortArticles([...originalResults], field, direction)
                      );
                    }}
                    isSearchable={false}
                    className="react-select"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold">Không tìm thấy kết quả</h2>
            </div>
          ) : (
            <>
              {results.map((article) => (
                <LongArticleCard
                  key={article.id}
                  imgURL={article.image_url}
                  title={article.title}
                  description={
                    article.description || article.paragraphs?.[0]?.text_en
                  }
                  cefr_level={article.cefr_level}
                  source={article.source_name}
                  updated_at={article.updated_at}
                  published_at={article.published_at}
                  views={article.views}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  maxVisiblePages={1}
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
