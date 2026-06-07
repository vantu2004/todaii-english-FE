import { useState } from "react";
import { useDictionarySearch } from "@/hooks/clients/useDictionarySearch";
import SearchHeader from "@/components/clients/dictionary_page/SearchHeader";
import SearchHistory from "@/components/clients/dictionary_page/SearchHistory";
import TopWordsList from "@/components/clients/dictionary_page/TopWordsList";
import LoadingSkeleton from "@/components/clients/dictionary_page/LoadingSkeleton";
import NotFoundState from "@/components/clients/dictionary_page/NotFoundState";
import FreeDictResult from "@/components/clients/dictionary_page/FreeDictResult";
import TodaiiDictResult from "@/components/clients/dictionary_page/TodaiiDictResult";
import { BookOpen, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SaveToNotebookModal from "@/components/clients/SaveToNotebookModal";

const Dictionary = () => {
  const {
    searchTerm,
    setSearchTerm,
    apiSource,
    setApiSource,
    data,
    isLoading,
    error,
    searchHistory,
    clearHistory,
    removeHistoryItem,
    executeSearch,
  } = useDictionarySearch();

  const [saveWord, setSaveWord] = useState("");
  const [saveEntryId, setSaveEntryId] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleSaveToNotebook = (word, entryId) => {
    setSaveWord(word);
    setSaveEntryId(entryId);
    setIsSaveModalOpen(true);
  };

  const handleWordClick = (word) => {
    setSearchTerm(word);
    executeSearch(word, apiSource);
  };

  const hasResults = !isLoading && !error && data;
  const isEmptyState = !isLoading && !error && !data;

  return (
    <AnimatePresence>
      <motion.div
        key="dictionary-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen flex-1 flex flex-col bg-surface-primary dark:bg-neutral-950 pt-24 pb-12 px-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col gap-6">
          {/* ─── Top Section: Full Width Search Header ─── */}
          <div className="w-full">
            <SearchHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              apiSource={apiSource}
              onSourceChange={setApiSource}
              isLoading={isLoading}
            />
          </div>

          {/* ─── Bottom Section: 2 Columns (History & Results) ─── */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-w-0">
            {/* Left Sidebar: Search History & Top Words (Desktop Only) */}
            <aside className="hidden lg:flex flex-col w-64 flex-shrink-0">
              <div className="sticky top-28 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-5 max-h-[calc(100vh-14rem)] overflow-y-auto shadow-sm">
                {searchHistory && searchHistory.length > 0 && (
                  <SearchHistory
                    history={searchHistory}
                    onHistoryClick={handleWordClick}
                    onRemoveItem={removeHistoryItem}
                    onClearAll={clearHistory}
                  />
                )}
                <TopWordsList onWordClick={handleWordClick} />
              </div>
            </aside>

            {/* Main Content Area: Results */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Mobile-only History */}
              <div className="lg:hidden mb-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-5 shadow-sm">
                {searchHistory && searchHistory.length > 0 && (
                  <SearchHistory
                    history={searchHistory}
                    onHistoryClick={handleWordClick}
                    onRemoveItem={removeHistoryItem}
                    onClearAll={clearHistory}
                  />
                )}
                <TopWordsList onWordClick={handleWordClick} />
              </div>

              {/* Result Container */}
              <div className="flex-1">
                {isLoading && <LoadingSkeleton />}

                {error === "NOT_FOUND" && (
                  <NotFoundState
                    word={searchTerm}
                    onSuggestionClick={handleWordClick}
                  />
                )}

                {error === "SERVER_ERROR" && (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                      <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      Đã xảy ra lỗi kết nối
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
                      Không thể kết nối đến máy chủ từ điển. Vui lòng kiểm tra
                      lại đường truyền mạng và thử lại sau.
                    </p>
                  </div>
                )}

                {hasResults && apiSource === "free" && (
                  <FreeDictResult
                    data={data}
                    onWordClick={handleWordClick}
                    onSaveToNotebook={handleSaveToNotebook}
                  />
                )}

                {hasResults && apiSource === "todaii" && (
                  <TodaiiDictResult
                    data={data}
                    onWordClick={handleWordClick}
                    onSaveToNotebook={handleSaveToNotebook}
                  />
                )}

                {isEmptyState && (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-355 dark:text-neutral-500 rounded-full flex items-center justify-center mb-6">
                      <BookOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                      Tra cứu từ điển trực tuyến
                    </h3>
                    <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-xs mx-auto">
                      Hãy nhập từ vựng tiếng Anh vào ô tìm kiếm phía trên để tra
                      cứu định nghĩa, phát âm và ví dụ.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <SaveToNotebookModal
        word={saveWord}
        entryId={saveEntryId}
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </AnimatePresence>
  );
};

export default Dictionary;
