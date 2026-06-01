import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import VocabHeader from "@/components/servers/manage_vocabs_page/VocabHeader";
import DictionarySearchPanel from "@/components/servers/manage_vocabs_page/DictionarySearchPanel";
import SelectedWordsPanel from "@/components/servers/manage_vocabs_page/SelectedWordsPanel";
import { logError } from "@/utils/LogError";
import { createWord } from "@/api/servers/dictionaryApi";
import DictionaryViewModal from "@/components/servers/manage_dictionary_page/DictionaryViewModal";
import VocabExtractionModal from "@/components/servers/manage_vocabs_page/VocabExtractionModal";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";

const VocabManagerContainer = ({
  fetchApi, // (id) => fetch data
  addApi, // (id, wordId) => add word
  deleteApi, // (id, wordId) => remove word
  clearApi, // (id) => clear vocab
  title,
  onVocabExtract, // optional
}) => {
  const { setHeader } = useHeaderContext();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [contentInfo, setContentInfo] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  const [isExtractionModalOpen, setIsExtractionModalOpen] = useState(false);
  const [extractedWords, setExtractedWords] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFetch = async () => {
    try {
      setLoading(true);

      const response = await fetchApi(id); // <== dùng API truyền vào module

      const sortedWords = response.words?.sort((a, b) => {
        const wordA = a.word || a.headword || "";
        const wordB = b.word || b.headword || "";
        return wordA.localeCompare(wordB);
      });

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

  const handleVocabExtract = async () => {
    if (!onVocabExtract) return;
    try {
      setIsExtracting(true);
      const words = await onVocabExtract(id);
      setExtractedWords(words || []);
      setIsExtractionModalOpen(true);
    } catch (error) {
      logError(error);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddCustomWord = async (word) => {
    try {
      const entry = await createWord(word.trim());
      await handleAdd(entry.id || entry.word_id);
      toast.success("Word created and added successfully");
    } catch (error) {
      logError(error);
      toast.error("Failed to create word");
    }
  };

  const handleAddExtractedWords = async (wordIds) => {
    try {
      for (const wordId of wordIds) {
        if (!selectedWords.some((w) => (w.id || w.word_id) === wordId)) {
          await addApi(id, wordId);
        }
      }
      await handleFetch();
      toast.success(`Added ${wordIds.length} words successfully`);
      setIsExtractionModalOpen(false);
    } catch (error) {
      logError(error);
      toast.error("Failed to add some words");
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
          onVocabExtract={onVocabExtract ? handleVocabExtract : null}
          isExtracting={isExtracting}
        />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-0"
        >
          <div className="flex flex-col lg:flex-row h-full min-h-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <DictionarySearchPanel
              selectedWords={selectedWords}
              onSelectWord={handleAdd}
              onAddCustomWord={handleAddCustomWord}
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

      {/* Extraction Modal */}
      <VocabExtractionModal
        isOpen={isExtractionModalOpen}
        onClose={() => setIsExtractionModalOpen(false)}
        extractedWords={extractedWords}
        currentWords={selectedWords}
        onAddSelected={handleAddExtractedWords}
      />
    </>
  );
};

export default VocabManagerContainer;
