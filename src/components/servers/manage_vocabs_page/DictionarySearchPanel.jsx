import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import DictionaryWordsList from "./DictionaryWordsList";
import AddCustomWordForm from "./AddCustomWordForm";
import { fetchDictionary } from "@/api/servers/dictionaryApi";
import { logError } from "@/utils/LogError";

const DictionarySearchPanel = ({
  selectedWords,
  onSelectWord,
  onAddCustomWord,
  onViewWord,
}) => {
  const [dictionaryWords, setDictionaryWords] = useState([]);

  const [query, setQuery] = useState({
    page: 1,
    size: 20,
    sortBy: "id",
    direction: "desc",
    keyword: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const reloadDictionary = async () => {
    try {
      const data = await fetchDictionary(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword,
      );

      setDictionaryWords(data.content || []);
    } catch (err) {
      logError(err);
    }
  };

  useEffect(() => {
    if (query.keyword.trim() !== "") {
      reloadDictionary();
    } else {
      setDictionaryWords([]);
    }
  }, [query]);

  // Delay search term → query.keyword
  useEffect(() => {
    const delay = setTimeout(() => {
      updateQuery({ keyword: searchTerm });
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const isWordSelected = (wordId) => {
    return selectedWords.some((w) => w.id === wordId);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 lg:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="p-4 sm:p-5 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Dictionary Search
          </h2>
          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Custom Word
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in dictionary..."
            className="w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Custom Word Form */}
        {showAddCustom && (
          <div className="px-4 sm:px-5 pt-4 border-b border-gray-100 dark:border-gray-800">
            <AddCustomWordForm
              onAdd={onAddCustomWord}
              onClose={() => setShowAddCustom(false)}
            />
          </div>
        )}

        <DictionaryWordsList
          words={dictionaryWords}
          isWordSelected={isWordSelected}
          onSelectWord={onSelectWord}
          onViewWord={onViewWord}
        />
      </div>
    </div>
  );
};

export default DictionarySearchPanel;
