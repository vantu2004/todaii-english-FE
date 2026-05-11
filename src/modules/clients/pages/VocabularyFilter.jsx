import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  BookOpen,
  LayoutGrid,
  Loader2,
  Filter,
  X as CloseX,
} from "lucide-react";
import { filterVocabDecks } from "@/api/clients/vocabDeckApi";
import { logError } from "@/utils/LogError";
import SearchBar from "@/components/clients/SearchBar";
import Pagination from "@/components/clients/Pagination";
import DeckCard from "@/components/clients/vocab_filter_page/DeckCard";
import VocabFilterSidebar from "@/components/clients/vocab_filter_page/VocabFilterSidebar";
import { motion, AnimatePresence } from "framer-motion";

export const SORT_OPTIONS = [
  { label: "Mới cập nhật", value: "updatedAt-desc" },
  { label: "Cũ nhất", value: "createdAt-asc" },
  { label: "Tên A-Z", value: "name-asc" },
  { label: "Tên Z-A", value: "name-desc" },
];

const VocabularyFilter = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ totalPages: 0, totalElements: 0 });
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [query, setQuery] = useState({
    keyword: "",
    cefrLevel: "",
    alias: "",
    page: 1,
    size: 9,
    sortBy: "updatedAt",
    direction: "desc",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await filterVocabDecks(query);
        if (res) {
          setDecks(res.content);
          setMeta({
            totalPages: res.total_pages,
            totalElements: res.total_elements,
          });
        }
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleSortChange = (e) => {
    const [sortBy, direction] = e.target.value.split("-");
    updateQuery({ sortBy, direction, page: 1 });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="vocab-filter-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col bg-surface-primary dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-end justify-between mb-10">
            <div className="w-full lg:max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight mb-6">
                Thư viện Từ vựng
              </h1>
              <div className="w-full">
                <SearchBar
                  value={query.keyword}
                  placeholder="Tìm kiếm bộ từ vựng..."
                  onChangeSearch={(val) =>
                    updateQuery({ keyword: val, page: 1 })
                  }
                />
              </div>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-300 shadow-sm"
              >
                <Filter size={18} /> Bộ lọc
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium hidden sm:inline">
                  Sắp xếp:
                </span>
                <div className="relative w-40 sm:w-48">
                  <select
                    className="w-full appearance-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 py-2.5 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-neutral-100 dark:focus:ring-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all cursor-pointer shadow-sm"
                    onChange={handleSortChange}
                    value={`${query.sortBy}-${query.direction}`}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar Overlay - Outside flex layout to avoid disrupting it */}
          <AnimatePresence>
            {showMobileFilter && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilter(false)}
                  className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 z-[70] w-[280px] bg-white dark:bg-neutral-900 p-6 shadow-2xl lg:hidden overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-neutral-900 dark:text-white">
                      Bộ lọc
                    </h3>
                    <button
                      onClick={() => setShowMobileFilter(false)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500 dark:text-neutral-400"
                    >
                      <CloseX size={20} />
                    </button>
                  </div>
                  <VocabFilterSidebar
                    query={query}
                    updateQuery={(val) => {
                      updateQuery(val);
                    }}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* --- MAIN LAYOUT --- */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <VocabFilterSidebar query={query} updateQuery={updateQuery} />
            </div>

            {/* Content Grid */}
            <main className="flex-1 min-w-0">
              {/* Result Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Hiển thị{" "}
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {meta.totalElements}
                  </span>{" "}
                  bộ từ vựng
                </p>
              </div>

              <div className="relative min-h-[400px]">
                {decks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {decks.map((deck) => (
                      <DeckCard key={deck.id} deck={deck} />
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <div className="bg-white dark:bg-neutral-900/60 rounded-3xl p-16 text-center border border-neutral-100 dark:border-neutral-800 shadow-sm">
                      <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LayoutGrid
                          size={32}
                          className="text-neutral-300 dark:text-neutral-600"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                        Không tìm thấy kết quả
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 max-w-xs mx-auto">
                        Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.
                      </p>
                      <button
                        onClick={() =>
                          updateQuery({
                            keyword: "",
                            cefrLevel: "",
                            alias: "",
                            page: 1,
                          })
                        }
                        className="mt-6 px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  )
                )}

                {/* Subtle Loading Overlay - Only shows when loading but doesn't hide content */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-10 bg-surface-primary/10 dark:bg-neutral-950/10 backdrop-blur-[1px] flex items-start justify-center pt-20 pointer-events-none"
                  >
                    <div className="bg-white dark:bg-neutral-900 p-3 rounded-full shadow-xl border border-neutral-100 dark:border-neutral-800">
                      <Loader2
                        size={24}
                        className="animate-spin text-brand-500"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Pagination */}
              {decks.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={query.page}
                    totalPages={meta.totalPages}
                    onPageChange={(p) => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      updateQuery({ page: p });
                    }}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VocabularyFilter;
