import React, { useEffect, useState } from "react";
import { getAllCollections } from "@/api/clients/toeicCollectionApi";
import {
  getAllTestsPaged,
  getAllTestsByCollectionPaged,
} from "@/api/clients/toeicTestApi";
import CollectionSidebar from "@/components/clients/toeic_page/home/CollectionSidebar";
import TestGrid from "@/components/clients/toeic_page/home/TestGrid";
import Pagination from "@/components/clients/Pagination";
import { logError } from "@/utils/LogError";
import RecommendationWidget from "@/components/clients/RecommendationWidget";

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

      const res = await getAllCollections();

      const enabledCollections = (res || []).filter((c) => c.enabled !== false);
      setCollections(enabledCollections);
    } catch (err) {
      logError(err);
    } finally {
      setLoadingCollections(false);
    }
  };

  const loadTests = async () => {
    try {
      setLoadingTests(true);

      let res;
      if (selectedCollection) {
        res = await getAllTestsByCollectionPaged(
          selectedCollection.id,
          page,
          size,
          sortBy,
          direction,
          keyword,
        );
      } else {
        res = await getAllTestsPaged(page, size, sortBy, direction, keyword);
      }

      setTests(res.content || []);

      setTotalPages(res.total_pages || 0);
      setTotalElements(res.total_elements || 0);
    } catch (err) {
      logError(err);

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

  const handleSortChange = (newSort, newDir) => {
    setSortBy(newSort);
    setDirection(newDir);
    setPage(1);
  };

  const handleSearchChange = (text) => {
    setKeyword(text);
    setPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-surface-primary dark:bg-neutral-950 pt-[68px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
            Luyện Thi TOEIC
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
            Cải thiện điểm số của bạn với hàng trăm đề thi TOEIC được cập nhật
            mới nhất.
          </p>
        </div>

        {/* Test Recommendations */}
        <RecommendationWidget type="tests" />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar / Collections */}
          <CollectionSidebar
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleSelectCollection}
            onSelectAll={handleSelectAll}
            loading={loadingCollections}
          />

          {/* Tests Grid */}
          <div className="flex-1 flex flex-col gap-6">
            <TestGrid
              tests={tests}
              selectedCollection={selectedCollection}
              totalElements={totalElements}
              keyword={keyword}
              onChangeSearch={handleSearchChange}
              sortBy={sortBy}
              direction={direction}
              onChangeSort={handleSortChange}
              loading={loadingTests}
            />

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeicHome;
