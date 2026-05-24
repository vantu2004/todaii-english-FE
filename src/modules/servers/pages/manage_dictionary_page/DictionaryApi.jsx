import { useEffect } from "react";
import { BookOpen, AlertTriangle } from "lucide-react";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import LoadingSkeleton from "@/components/servers/manage_dictionary_page/LoadingSkeleton";
import FreeDictResult from "@/components/servers/manage_dictionary_page/FreeDictResult";
import SearchHeader from "@/components/servers/manage_dictionary_page/SeachHeader";
import NotFoundState from "@/components/servers/manage_dictionary_page/NotFoundState";
import TodaiiDictResult from "@/components/servers/manage_dictionary_page/TodaiiDictResult";
import SearchHistory from "@/components/servers/manage_dictionary_page/SearchHistory";
import { useDictionarySearch } from "@/hooks/servers/useDictionarySearch";

const DictionaryApi = () => {
  const { setHeader } = useHeaderContext();

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

  useEffect(() => {
    setHeader({
      title: "Manage Dictionary",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Dictionary API" },
      ],
    });
  }, [setHeader]);

  const handleWordClick = (word) => {
    setSearchTerm(word);
    executeSearch(word, apiSource);
  };

  const hasResults = !isLoading && !error && data;
  const isEmptyState = !isLoading && !error && !data;

  return (
    <div className="flex flex-col gap-6 h-full">
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

        {/* Left Sidebar: Search History (Desktop Only) */}
        {searchHistory && searchHistory.length > 0 && (
          <aside className="hidden lg:flex flex-col w-64 flex-shrink-0">
            <div className="sticky top-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
              <SearchHistory
                history={searchHistory}
                onHistoryClick={handleWordClick}
                onRemoveItem={removeHistoryItem}
                onClearAll={clearHistory}
              />
            </div>
          </aside>
        )}

        {/* Main Content Area: Results */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Mobile-only History (Hiển thị dưới Search Bar trên màn hình nhỏ) */}
          {searchHistory && searchHistory.length > 0 && (
            <div className="lg:hidden mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
              <SearchHistory
                history={searchHistory}
                onHistoryClick={handleWordClick}
                onRemoveItem={removeHistoryItem}
                onClearAll={clearHistory}
              />
            </div>
          )}

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
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Something went wrong
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Failed to connect to the dictionary service. Please check the server status and try again.
                </p>
              </div>
            )}

            {hasResults && apiSource === "free" && (
              <FreeDictResult data={data} onWordClick={handleWordClick} />
            )}

            {hasResults && apiSource === "todaii" && (
              <TodaiiDictResult data={data} onWordClick={handleWordClick} />
            )}

            {isEmptyState && (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-5">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Explore the Dictionary
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  Type any English word in the search bar above to look up definitions, pronunciation, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictionaryApi;