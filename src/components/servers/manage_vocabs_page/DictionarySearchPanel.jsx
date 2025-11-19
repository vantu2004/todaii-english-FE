import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import DictionaryWordsList from "./DictionaryWordsList";
import AddCustomWordForm from "./AddCustomWordForm";
import { fetchDictionary } from "../../../api/servers/dictionaryApi";
import { logError } from "../../../utils/LogError";

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
        query.keyword
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
    <div className="lg:col-span-2 flex flex-col overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full ">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Dictionary Search
          </h2>
          <button
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="px-4 py-2 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Word
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in dictionary..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Custom Word Form */}
        {showAddCustom && (
          <AddCustomWordForm
            onAdd={onAddCustomWord}
            onClose={() => setShowAddCustom(false)}
          />
        )}

        {/* Words List */}
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
