import { useState, useEffect } from "react";
import { Volume2, Languages, ChevronDown, Loader2 } from "lucide-react";
import { logError } from "@/utils/LogError";
import { handleSpeak } from "@/utils/ReactSpeechKit";
import DictionaryModal from "./DictionaryModal";
import SaveToNotebookModal from "./SaveToNotebookModal";

const EntryWordList = ({ id, fetchApi, pageSize = 6 }) => {
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  // States cho Dictionary Modal
  const [activeWord, setActiveWord] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States cho SaveToNotebook Modal
  const [saveWord, setSaveWord] = useState("");
  const [saveEntryId, setSaveEntryId] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleOpenSaveModal = (word, entryId = null) => {
    setSaveWord(word);
    setSaveEntryId(entryId);
    setIsSaveModalOpen(true);
  };

  useEffect(() => {
    if (id) fetchWords(1);
  }, [id]);

  const fetchWords = async (pageNum) => {
    try {
      setLoading(true);
      setIsFirstLoad(pageNum === 1);

      const res = await fetchApi(id, pageNum, pageSize);
      if (res) {
        setWords((prev) =>
          pageNum === 1 ? res.content : [...prev, ...res.content],
        );
        setHasMore(!res.last);
        setPage(pageNum);
      }
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) fetchWords(page + 1);
  };

  const handleOpenModal = (word) => {
    if (word) {
      setActiveWord(word);
      setIsModalOpen(true);
    }
  };

  if (isFirstLoad && loading) {
    return (
      <div className="bg-white dark:bg-neutral-900/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-850/80 shadow-sm mt-6 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-150 dark:border-neutral-800 animate-pulse">
          <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-48 bg-neutral-100 dark:bg-neutral-800 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-14 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-lg animate-pulse border border-neutral-100/50 dark:border-neutral-800/50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!loading && words.length === 0) return null;

  return (
    <div className="bg-white dark:bg-neutral-900/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-850/80 shadow-sm mt-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-150 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400 rounded-md">
            <Languages size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base tracking-tight">
              Từ vựng quan trọng
            </h3>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
              Từ vựng chính xuất hiện trong nội dung bài học
            </p>
          </div>
        </div>

        {/* Total Badge */}
        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50">
          Tổng số: {words.length} từ
        </span>
      </div>

      {/* Word List (Each word on one row) */}
      <div className="grid grid-cols-1 gap-2">
        {words.map((entry, index) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 rounded-lg bg-neutral-50/30 dark:bg-neutral-900/20 
              border border-neutral-150 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-900 
              hover:border-brand-500/20 dark:hover:border-brand-500/20 transition-colors duration-150 group"
          >
            {/* LEFT: Index & Word */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 select-none">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-medium text-neutral-850 dark:text-neutral-200 select-all font-serif group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                {entry.word}
              </span>
            </div>

            {/* RIGHT: Speak Audio & View Details Link */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak(entry.word, "");
                }}
                className="w-7 h-7 rounded bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 
                  flex items-center justify-center border border-neutral-200/50 dark:border-neutral-700/50 
                  hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-100 dark:hover:border-brand-900 transition-colors"
                title="Nghe phát âm"
              >
                <Volume2 size={13} />
              </button>

              <button
                onClick={() => handleOpenModal(entry.word)}
                className="px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 
                  hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                Xem nghĩa
              </button>

              <button
                onClick={() => handleOpenSaveModal(entry.word, entry.id)}
                className="px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 
                  hover:text-brand-500 dark:hover:text-brand-400 transition-colors border-l border-neutral-200 dark:border-neutral-700 pl-2"
              >
                Lưu sổ tay
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-4 pt-1 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 
              bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md 
              border border-neutral-200 dark:border-neutral-700 disabled:opacity-70 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span>Xem thêm từ vựng</span>
                <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Reusable Dictionary Modal */}
      <DictionaryModal
        word={activeWord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <SaveToNotebookModal
        word={saveWord}
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </div>
  );
};

export default EntryWordList;
