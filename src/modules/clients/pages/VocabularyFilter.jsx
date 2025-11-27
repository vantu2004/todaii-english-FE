import React, { useState, useEffect } from "react";
import { ChevronDown, BookOpen, LayoutGrid, Loader2 } from "lucide-react";
import { filterVocabDecks } from "../../../api/clients/vocabDeckApi";
import { logError } from "../../../utils/LogError";
import SearchBar from "../../../components/clients/SearchBar";
import Pagination from "../../../components/clients/Pagination";
import DeckCard from "../../../components/clients/vocab_filter_page/DeckCard";
import VocabFilterSidebar from "../../../components/clients/vocab_filter_page/VocabFilterSidebar";
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
    <AnimatePresence>
      <motion.div
        key="dictionary-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-neutral-50/50 pt-24 pb-12 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col lg:flex-row gap-6 items-end justify-between mb-10">
            <div className="w-full lg:max-w-2xl">
              <h1 className="text-3xl font-light text-neutral-900 tracking-tight mb-6">
                Thư viện Từ vựng
              </h1>
              <SearchBar
                value={query.keyword}
                placeholder="Tìm kiếm bộ từ vựng..."
                onChangeSearch={(val) => updateQuery({ keyword: val, page: 1 })}
              />
            </div>

            {/* Sort Combobox */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-500 font-medium hidden sm:inline">
                Sắp xếp:
              </span>
              <div className="relative w-full sm:w-48">
                <select
                  className="w-full appearance-none bg-white border border-neutral-200 text-neutral-700 py-3 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-neutral-100 hover:border-neutral-300 transition-all cursor-pointer"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* --- MAIN LAYOUT --- */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Sidebar (Component tách rời) */}
            <VocabFilterSidebar query={query} updateQuery={updateQuery} />

            {/* Content Grid */}
            <main className="flex-1 w-full">
              {/* Result Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  Hiển thị{" "}
                  <span className="font-bold text-neutral-900">
                    {meta.totalElements}
                  </span>{" "}
                  bộ từ vựng
                </p>
              </div>

              {/* List / Loading / Empty */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-48 bg-white rounded-3xl border border-neutral-100 animate-pulse shadow-sm"
                    />
                  ))}
                </div>
              ) : decks.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {decks.map((deck) => (
                      <DeckCard key={deck.id} deck={deck} />
                    ))}
                  </div>

                  {/* Pagination */}
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
                </>
              ) : (
                /* Empty State */
                <div className="bg-white rounded-3xl p-16 text-center border border-neutral-100 shadow-sm">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid size={32} className="text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-neutral-500 text-sm mt-2 max-w-xs mx-auto">
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
                    className="mt-6 px-6 py-2.5 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
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
