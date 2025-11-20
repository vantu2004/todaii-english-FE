import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import LongArticleCard from "../../../../components/clients/home_page/LongArticleCard";
import Pagination from "../../../../components/clients/Pagination";
import ArticleFilter from "../../../../components/clients/search_result_page/ArticleFilter";
import SearchBar from "../../../../components/clients/SearchBar";
import useArticleSearch from "../../../../hooks/clients/useArticleSearch";

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

const TopicResults = () => {

  // To-do: Bổ sung thêm api để lấy bài báo theo chủ đê (topic)

  const { topicId } = useParams(); // Get topic ID from URL params
  const navigate = useNavigate();

  // Query state
  const [query, setQuery] = useState({
    keyword: "",
    topicId: topicId || "",
    sourceName: "",
    cefrLevel: "",
    page: 1,
    size: 5,
    sortBy: "published_at",
    direction: "desc",
  });

  const updateQuery = (values) => setQuery((prev) => ({ ...prev, ...values }));

  const { results, totalResults, totalPages, loading } =
    useArticleSearch(query);

  // Get current topic name for display
  const currentTopic = topicOptions.find((t) => t.value === query.topicId);
  const topicName = currentTopic ? currentTopic.label : "Tất cả chủ đề";

  // Update query when topicId from URL changes
  useEffect(() => {
    if (topicId) {
      updateQuery({ topicId, page: 1 });
    }
  }, [topicId]);

  return (
    <div className="mt-6 mb-10 min-h-screen bg-[#f9fafc] pt-20 px-4 md:px-8">
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
          <SearchBar
            value={query.keyword}
            placeholder="Tìm kiếm bài viết trong chủ đề..."
            onSearch={(keyword) => {
              updateQuery({ keyword, page: 1 });
            }}
          />

          {/* HEADER */}
          <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Chủ đề: <span className="text-blue-600">{topicName}</span>
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
                (o) => `${query.sortBy}-${query.direction}` === o.value
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
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                Không tìm thấy bài viết nào
              </p>
              {query.keyword && (
                <p className="text-gray-500 mt-2">
                  Thử tìm kiếm với từ khóa khác
                </p>
              )}
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

export default TopicResults;