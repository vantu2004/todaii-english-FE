import React from "react";
import SearchBar from "@/components/clients/SearchBar";
import TestCard from "./TestCard";
import { BookOpen } from "lucide-react";

const TestGrid = ({
  tests = [],
  selectedCollection = null,
  totalElements = 0,
  keyword = "",
  onChangeSearch,
  sortBy = "id",
  direction = "desc",
  onChangeSort,
  loading = false,
}) => {
  return (
    <div className="flex-1">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-1">
            {selectedCollection ? selectedCollection.name : "Tất cả đề thi"}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Tìm thấy{" "}
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
              {totalElements}
            </span>{" "}
            đề thi
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <SearchBar
              value={keyword}
              placeholder="Tìm kiếm đề thi..."
              onChangeSearch={onChangeSearch}
            />
          </div>

          <select
            value={`${sortBy}-${direction}`}
            onChange={(e) => {
              const [newSort, newDir] = e.target.value.split("-");
              onChangeSort(newSort, newDir);
            }}
            className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="id-desc">Mới nhất</option>
            <option value="id-asc">Cũ nhất</option>
            <option value="title-asc">Tên A - Z</option>
            <option value="title-desc">Tên Z - A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-neutral-900 h-72 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-800 rounded-md"></div>
                <div className="h-4 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
                <div className="h-3.5 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded"></div>
              </div>
              <div className="h-9 w-full bg-neutral-100 dark:bg-neutral-800 rounded-md mt-3"></div>
            </div>
          ))}
        </div>
      ) : tests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 border-dashed">
          <BookOpen className="mx-auto h-10 w-10 text-neutral-300 dark:text-neutral-600 mb-3" />
          <p className="text-base font-medium text-neutral-900 dark:text-white mb-1">
            Không tìm thấy đề thi
          </p>
          <p className="text-xs">
            Thử tìm kiếm với từ khóa khác hoặc chuyển sang bộ đề thi khác.
          </p>
        </div>
      )}
    </div>
  );
};

export default TestGrid;
