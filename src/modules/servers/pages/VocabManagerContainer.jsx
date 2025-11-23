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
import { useHeaderContext } from "../../../hooks/servers/useHeaderContext";

const VocabManagerContainer = ({
  fetchApi, // (id) => fetch data
  addApi, // (id, wordId) => add word
  deleteApi, // (id, wordId) => remove word
  clearApi, // (id) => clear vocab
  title,
  onAutoGenerate, // optional
}) => {
  const { setHeader } = useHeaderContext();

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

      const sortedWords = response.words?.sort((a, b) =>
        a.headword.localeCompare(b.headword)
      );

      setSelectedWords(sortedWords || []);
      setContentInfo({
        type: title,
        title: response.name || response.title,
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

  useEffect(() => {
    const breadcrumbs = [
      { label: "Home", to: "/server" },
      ...(title === "ARTICLE"
        ? [{ label: "Manage Articles", to: "/server/article" }]
        : title === "VIDEO"
        ? [{ label: "Manage Videos", to: "/server/video" }]
        : title === "VOCABULARY DECK"
        ? [{ label: "Manage Vocabulary Decks", to: "/server/vocab-deck" }]
        : []),
      { label: "Manage Vocabularies" },
    ];

    setHeader({
      title:
        title === "ARTICLE"
          ? "Manage Articles"
          : title === "VIDEO"
          ? "Manage Videos"
          : title === "VOCABULARY DECK"
          ? "Manage Vocabulary Decks"
          : title,
      breadcrumb: breadcrumbs,
    });
  }, [title]);

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}

        <VocabHeader
          contentInfo={contentInfo}
          onAutoGenerate={onAutoGenerate ? handleAutoGenerate : null}
        />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-0"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 h-full min-h-0">
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

export default VocabManagerContainer;
