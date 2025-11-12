import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createDictionaryEntry,
  createDictionaryEntryByGemini,
  fetchDictionary,
} from "../../../api/servers/dictionaryApi";
import ToolBar from "../../../components/servers/ToolBar";
import Pagination from "../../../components/servers/Pagination";
import DictionaryTable from "../../../components/servers/manage_dictionary_page/DictionaryTable";
import DictionaryFormModal from "../../../components/servers/manage_dictionary_page/DictionaryFormModal";
import { Sparkles, Loader } from "lucide-react";
import DictionaryViewModal from "../../../components/servers/manage_dictionary_page/DictionaryViewModal";
import { set } from "date-fns";

const ManageDictionary = () => {
  const [dictionary, setDictionary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdWordByGemini, setCreatedWordByGemini] = useState({});

  // State chung cho phân trang, sort, search
  const [query, setQuery] = useState({
    page: 1,
    size: 20,
    sortBy: "headword",
    direction: "asc",
    keyword: "",
  });

  // State metadata từ API
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const columns = [
    { key: "id", label: "ID", sortField: "id" },
    { key: "headword", label: "Headword", sortField: "headword" },
    { key: "ipa", label: "IPA", sortField: "ipa" },
    { key: "audioUrl", label: "Audio", sortField: "audioUrl" },
    { key: "updatedAt", label: "Updated At", sortField: "updatedAt" },
    { key: "actions", label: "Actions" },
  ];

  const reloadDictionary = async () => {
    try {
      setLoading(true);

      const data = await fetchDictionary(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setDictionary(data.content || []);

      // Lưu metadata cho pagination component
      setPagination({
        totalElements: data.total_elements,
        totalPages: data.total_pages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Error loading dictionary:", err);
      toast.error("Failed to load dictionary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadDictionary();
  }, [query]); // tự động reload khi query thay đổi

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleConfirmCreate = async (data) => {
    try {
      await createDictionaryEntry(data);
      await reloadDictionary();

      setIsCreateModalOpen(false);
      toast.success("Dictionary entry created successfully");
    } catch (error) {
      console.error("Error creating dictionary entry:", error);

      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0]); // chỉ hiển thị lỗi đầu tiên
      } else {
        toast.error("Failed to create dictionary entry");
      }
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter" && newWord.trim() !== "" && !isCreating) {
      setIsCreating(true);
      try {
        const response = await createDictionaryEntryByGemini(newWord);
        await reloadDictionary();

        // kết quả trả về là list nên lấy phần tử đầu tiên
        setCreatedWordByGemini(response[0]);
        setIsViewModalOpen(true);
        setNewWord("");
        setShowInput(false);

        toast.success("Dictionary entry created successfully");
      } catch (error) {
        toast.error("Failed to create dictionary entry");
      } finally {
        setIsCreating(false);
      }
    }

    if (e.key === "Escape") {
      setShowInput(false);
      setNewWord("");
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Dictionary
        </h2>

        <ToolBar
          updateQuery={updateQuery}
          setIsModalOpen={setIsCreateModalOpen}
        />

        <div className="mt-6 mb-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 flex-1">
              Dictionary Entries Table
            </h4>
          </div>

          {/* Input Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* AI Create Button */}
            <button
              onClick={() => setShowInput(true)}
              disabled={isCreating || showInput}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl 
          bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium
          hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-400
          transition-all duration-200 transform hover:scale-105 active:scale-95 
          shadow-md hover:shadow-lg disabled:shadow-none flex-shrink-0"
            >
              <Sparkles className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">AI Create</span>
            </button>

            {/* Input or Loading State */}
            <div className="flex-1 relative">
              {!isCreating ? (
                showInput ? (
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Enter new word..."
                      disabled={isCreating}
                      className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 
                  rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  dark:focus:border-blue-400 dark:focus:ring-blue-900/30
                  transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      Press{" "}
                      <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono">
                        Enter
                      </kbd>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2.5 text-gray-500 dark:text-gray-400 text-sm italic">
                    Click the AI Create button to add a new word
                  </div>
                )
              ) : (
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    Creating entry...
                  </span>
                </div>
              )}
            </div>

            {/* Cancel Button (show when input is open) */}
            {showInput && !isCreating && (
              <button
                onClick={() => {
                  setShowInput(false);
                  setNewWord("");
                }}
                className="px-4 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 
            border-2 border-gray-300 dark:border-gray-600
            hover:bg-gray-50 dark:hover:bg-gray-800/50
            transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Helper Text */}
          {showInput && !isCreating && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Type a word and press Enter to create a new dictionary entry
            </p>
          )}
        </div>
      </div>

      {/* Vùng bảng cuộn riêng */}
      <div className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm">
        <DictionaryTable
          columns={columns}
          dictionary={dictionary}
          reloadDictionary={reloadDictionary}
          query={query}
          updateQuery={updateQuery}
        />
      </div>

      {/* Pagination */}
      <div className="flex-none mt-4">
        <Pagination
          query={query}
          updateQuery={updateQuery}
          pagination={pagination}
        />
      </div>

      {/* View Modal */}
      {createdWordByGemini && (
        <DictionaryViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          dictionary={createdWordByGemini}
        />
      )}

      {/* Modal */}
      {isCreateModalOpen && (
        <DictionaryFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
          initialData={{}}
          onSubmit={handleConfirmCreate}
        />
      )}
    </div>
  );
};

export default ManageDictionary;
