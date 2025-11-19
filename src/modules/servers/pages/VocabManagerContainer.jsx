import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import VocabHeader from "../../../components/servers/manage_vocabs_page/VocabHeader";
import DictionarySearchPanel from "../../../components/servers/manage_vocabs_page/DictionarySearchPanel";
import SelectedWordsPanel from "../../../components/servers/manage_vocabs_page/SelectedWordsPanel";
import { logError } from "../../../utils/LogError";
import { createDictionaryEntryByGemini } from "../../../api/servers/dictionaryApi";
import DictionaryViewModal from "../../../components/servers/manage_dictionary_page/DictionaryViewModal";

const VocanManagerContainer = ({
  fetchApi, // (id) => fetch data
  addApi, // (id, wordId) => add word
  deleteApi, // (id, wordId) => remove word
  clearApi, // (id) => clear vocab
  title = "VOCABULARY",
  onAutoGenerate, // optional
}) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [contentInfo, setContentInfo] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  const handleFetch = async () => {
    try {
      setLoading(true);

      const response = await fetchApi(id); // <== dùng API truyền vào module

      const sortedWords = response.words.sort((a, b) =>
        a.headword.localeCompare(b.headword)
      );

      setSelectedWords(sortedWords);
      setContentInfo({
        type: title,
        title: response.name,
      });
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [id]);

  const handleAutoGenerate = async () => {
    if (!onAutoGenerate) return;

    try {
      await onAutoGenerate(id);
      await handleFetch();
      toast.success("Generated vocabularies successfully");
    } catch (error) {
      toast.error("Failed to generate vocabularies");
    }
  };

  const handleCreateDictionaryEntryByGemini = async (word) => {
    try {
      const response = await createDictionaryEntryByGemini(word.trim());

      for (const entry of response) {
        await handleAdd(entry.id);
      }

      toast.success("Word created by AI successfully");
    } catch (error) {
      logError(error);
    }
  };

  const handleAdd = async (wordId) => {
    try {
      await addApi(id, wordId);
      await handleFetch();
    } catch (error) {
      logError(error);
    }
  };

  const handleDelete = async (wordId) => {
    try {
      await deleteApi(id, wordId);
      await handleFetch();
    } catch (error) {
      logError(error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearApi(id);
      await handleFetch();
    } catch (error) {
      logError(error);
    }
  };

  const handleViewWord = (word) => {
    setSelectedWord(word);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-none mb-4 sm:mb-5 md:mb-6 px-4 sm:px-6 lg:px-0">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Content</span>
          </button>

          <VocabHeader
            contentInfo={contentInfo}
            onAutoGenerate={handleAutoGenerate}
          />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 h-full">
            <DictionarySearchPanel
              selectedWords={selectedWords}
              onSelectWord={handleAdd}
              onAddCustomWord={handleCreateDictionaryEntryByGemini}
              onViewWord={handleViewWord}
            />

            <SelectedWordsPanel
              selectedWords={selectedWords}
              onRemoveWord={handleDelete}
              onClearAll={handleClearAll}
              onViewWord={handleViewWord}
            />
          </div>
        </motion.div>
      </div>

      {/* View Modal */}
      {selectedWord && (
        <DictionaryViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          dictionary={selectedWord}
        />
      )}
    </>
  );
};

export default VocanManagerContainer;
