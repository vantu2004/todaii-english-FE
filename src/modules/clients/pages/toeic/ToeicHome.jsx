import React, { useEffect, useState } from "react";
import { fetchToeicCollections, fetchTestsByCollectionId, fetchToeicTests } from "@/api/clients/toeicApi";
import { BookOpen, GraduationCap, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "@/components/clients/SearchBar";
import Pagination from "@/components/clients/Pagination";

const ToeicHome = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [tests, setTests] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);

  // Search, sort, and pagination states
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("desc");
  const size = 9; // 3 columns grid: 9 items is perfect

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    loadTests();
  }, [selectedCollection, keyword, page, sortBy, direction]);

  const loadCollections = async () => {
    try {
      setLoadingCollections(true);
      const res = await fetchToeicCollections(1, 100);
      setCollections(res.content || []);
      // Select first collection by default if available
      if (res.content && res.content.length > 0) {
        setSelectedCollection(res.content[0]);
      }
    } catch (err) {
      console.error("Failed to load collections", err);
    } finally {
      setLoadingCollections(false);
    }
  };

  const loadTests = async () => {
    try {
      setLoadingTests(true);
      let res;
      if (selectedCollection) {
        res = await fetchTestsByCollectionId(
          selectedCollection.id,
          page,
          size,
          sortBy,
          direction,
          keyword
        );
      } else {
        res = await fetchToeicTests(
          page,
          size,
          sortBy,
          direction,
          keyword
        );
      }
      setTests(res.content || []);
      setTotalPages(res.totalPages || res.total_pages || 0);
      setTotalElements(res.totalElements || res.total_elements || 0);
    } catch (err) {
      console.error("Failed to load tests", err);
      setTests([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleSelectCollection = (collection) => {
    setSelectedCollection(collection);
    setPage(1);
  };

  const handleSelectAll = () => {
    setSelectedCollection(null);
    setPage(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-[68px]">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">
          Luyện Thi TOEIC
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
          Cải thiện điểm số của bạn với hàng trăm đề thi TOEIC được cập nhật mới nhất.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar / Collections */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm border border-neutral-100 dark:border-neutral-800 sticky top-[100px]">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 px-2 flex items-center gap-2">
              <BookOpen className="text-brand-500" size={20} />
              Bộ Đề Thi
            </h2>
            
            {loadingCollections ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={handleSelectAll}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    selectedCollection === null
                      ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white font-medium"
                  }`}
                >
                  <span className="truncate">Tất cả đề thi</span>
                  {selectedCollection === null && (
                    <ChevronRight size={16} />
                  )}
                </button>

                {collections.map(collection => (
                  <button
                    key={collection.id}
                    onClick={() => handleSelectCollection(collection)}
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
            )}
          </div>
        </div>

        {/* Tests Grid */}
        <div className="lg:w-3/4">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                {selectedCollection ? selectedCollection.name : "Tất cả đề thi"}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Tìm thấy <span className="font-semibold text-neutral-700 dark:text-neutral-300">{totalElements}</span> đề thi
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="w-full sm:w-72">
                <SearchBar
                  value={keyword}
                  placeholder="Tìm kiếm đề thi..."
                  onChangeSearch={(text) => {
                    setKeyword(text);
                    setPage(1);
                  }}
                />
              </div>

              <select
                value={`${sortBy}-${direction}`}
                onChange={(e) => {
                  const [newSort, newDir] = e.target.value.split("-");
                  setSortBy(newSort);
                  setDirection(newDir);
                  setPage(1);
                }}
                className="w-full sm:w-auto px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="id-desc">Mới nhất</option>
                <option value="id-asc">Cũ nhất</option>
                <option value="title-asc">Tên A - Z</option>
                <option value="title-desc">Tên Z - A</option>
              </select>
            </div>
          </div>

          {loadingTests ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 h-48 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 animate-pulse flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-6 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded-lg"></div>
                    <div className="h-4 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded-lg"></div>
                  </div>
                  <div className="h-10 w-full bg-neutral-100 dark:bg-neutral-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {tests.length > 0 ? (
                  tests.map(test => (
                    <div key={test.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.02)] transition-all duration-300 group">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                            <GraduationCap className="text-brand-500" size={20} />
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-500 transition-colors">
                          {test.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>120 phút</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={14} />
                            <span>7 phần</span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/client/toeic/${test.id}`}
                        className="mt-6 w-full py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium rounded-xl text-center group-hover:bg-brand-500 group-hover:text-white transition-all duration-300"
                      >
                        Chi tiết đề thi
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 border-dashed">
                    <BookOpen className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600 mb-4" />
                    <p className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                      Không tìm thấy đề thi
                    </p>
                    <p className="text-sm">
                      Thử tìm kiếm với từ khóa khác hoặc chuyển sang bộ đề thi khác.
                    </p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToeicHome;
