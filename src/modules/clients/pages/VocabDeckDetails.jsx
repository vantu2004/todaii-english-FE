import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PlayCircle,
  Gamepad2,
  Volume2,
  Shuffle,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Download,
  RefreshCw,
  AlertCircle,
  Zap,
  Keyboard,
  BookOpen,
  Calendar,
  BookMarked,
} from "lucide-react";
import { getVocabDeckById } from "@/api/clients/vocabDeckApi";
import { searchByTodaiiDictionary } from "@/api/clients/dictionaryApi";
import FlashcardGame from "@/components/clients/vocab_deck_details_page/FlashcardGame";
import QuizGame from "@/components/clients/vocab_deck_details_page/QuizGame";
import { formatISODate } from "@/utils/FormatDate";
import TypingGame from "@/components/clients/vocab_deck_details_page/TypingGame";
import SpeedRoundGame from "@/components/clients/vocab_deck_details_page/SpeedRoundGame";
import { loadVoices, handleSpeak } from "@/utils/ReactSpeechKit";
import DictionaryModal from "@/components/clients/DictionaryModal";
import SaveToNotebookModal from "@/components/clients/SaveToNotebookModal";

// ─── Helper: parse json_data string → flat word object ───────────────────────
const parseJsonData = (jsonDataStr) => {
  if (!jsonDataStr) return null;
  try {
    const parsed =
      typeof jsonDataStr === "string" ? JSON.parse(jsonDataStr) : jsonDataStr;
    if (!parsed?.found || !parsed?.result?.length) return null;

    const result = parsed.result[0];
    // IPA: ưu tiên GB, fallback US, base
    const ipa =
      result.pronounce?.gb ||
      result.pronounce?.us ||
      result.pronounce?.base ||
      null;

    // Tìm content có kind là "danh từ" / "động từ" / etc. (loại trừ field chuyên ngành)
    const mainContent =
      result.content?.find((c) => !c.field) || result.content?.[0];

    const pos = mainContent?.kind || null;
    const meaning = mainContent?.means?.[0]?.mean || null;
    const example = mainContent?.means?.[0]?.examples?.[0]?.e || null;

    return { ipa, pos, meaning, example };
  } catch {
    return null;
  }
};

// ─── Helper: map raw API word → display object ────────────────────────────────
const mapWord = (w) => {
  const parsed = parseJsonData(w.json_data);
  return {
    id: w.id,
    word: w.word,
    ipa: parsed?.ipa || null,
    audio_url: w.audio_url || null,
    pos: parsed?.pos || null,
    meaning: parsed?.meaning || null,
    example: parsed?.example || null,
    hasData: !!parsed?.meaning, // dùng để biết từ đã có dữ liệu hay chưa
  };
};

// ─── Sub-component: Badge trạng thái + nút fetch ──────────────────────────────
const FetchDataButton = ({ wordText, onFetched, isFetching }) => {
  if (isFetching) {
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
        <Loader2 size={12} className="animate-spin" /> Đang tải...
      </span>
    );
  }

  return (
    <button
      onClick={onFetched}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-400 dark:text-neutral-500 hover:border-neutral-500 dark:hover:border-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
    >
      <Download size={11} /> Tải dữ liệu từ điển
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const VocabDeckDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list"); // 'list' | 'flashcard' | 'quiz'

  const [showMeaning, setShowMeaning] = useState(true);
  const [showWord, setShowWord] = useState(true);

  // Track từng từ đang fetch: { [wordId]: boolean }
  const [fetchingIds, setFetchingIds] = useState({});
  // Track từng từ fetch thất bại: { [wordId]: boolean }
  const [errorIds, setErrorIds] = useState({});

  const [activeWord, setActiveWord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveWord, setSaveWord] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleOpenModal = (word) => {
    if (word) {
      setActiveWord(word);
      setIsModalOpen(true);
    }
  };

  const handleOpenSaveModal = (word) => {
    setSaveWord(word);
    setIsSaveModalOpen(true);
  };

  useEffect(() => {
    loadVoices();

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // ─── Fetch deck ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getVocabDeckById(id);
        if (res) {
          setDeck(res);
          setWords((res.words || []).map(mapWord));
        }
      } catch (error) {
        console.error("Failed to load deck", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ─── Fetch dictionary data cho 1 từ ─────────────────────────────────────────
  const handleFetchWordData = useCallback(async (wordItem) => {
    setFetchingIds((prev) => ({ ...prev, [wordItem.id]: true }));
    setErrorIds((prev) => ({ ...prev, [wordItem.id]: false }));

    try {
      const res = await searchByTodaiiDictionary(wordItem.word, 1, 1);
      // res có dạng { found, total, result: [...] }
      const parsed = parseJsonData(res);

      if (parsed?.meaning) {
        setWords((prev) =>
          prev.map((w) =>
            w.id === wordItem.id
              ? {
                  ...w,
                  ipa: parsed.ipa ?? w.ipa,
                  pos: parsed.pos ?? w.pos,
                  meaning: parsed.meaning,
                  example: parsed.example ?? w.example,
                  hasData: true,
                }
              : w,
          ),
        );
      } else {
        // API trả về nhưng không có dữ liệu phù hợp
        setErrorIds((prev) => ({ ...prev, [wordItem.id]: true }));
      }
    } catch (err) {
      console.error("Failed to fetch word data", err);
      setErrorIds((prev) => ({ ...prev, [wordItem.id]: true }));
    } finally {
      setFetchingIds((prev) => ({ ...prev, [wordItem.id]: false }));
    }
  }, []);

  // ─── Fetch tất cả từ chưa có data ───────────────────────────────────────────
  const handleFetchAll = useCallback(async () => {
    const missing = words.filter((w) => !w.hasData);
    // Chạy tuần tự để tránh spam API
    for (const w of missing) {
      await handleFetchWordData(w);
    }
  }, [words, handleFetchWordData]);

  // ─── Shuffle ─────────────────────────────────────────────────────────────────
  const handleShuffle = () => {
    setWords((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const playAudio = (e, item) => {
    e.stopPropagation();
    handleSpeak(item.word, item.audio_url);
  };

  // ─── Derived ─────────────────────────────────────────────────────────────────
  const missingCount = words.filter((w) => !w.hasData).length;
  const isFetchingAny = Object.values(fetchingIds).some(Boolean);

  // ─── Loading / Empty ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Loader2
          className="animate-spin text-neutral-400 dark:text-neutral-500"
          size={32}
        />
      </div>
    );
  }

  if (!deck) return null;

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 font-sans">
      {/* Game overlays */}
      {mode === "flashcard" && (
        <FlashcardGame
          words={words.filter((w) => w.hasData)}
          onClose={() => setMode("list")}
        />
      )}
      {mode === "quiz" && (
        <QuizGame
          words={words.filter((w) => w.hasData)}
          onClose={() => setMode("list")}
        />
      )}
      {mode === "speed" && (
        <SpeedRoundGame
          words={words.filter((w) => w.hasData)}
          onClose={() => setMode("list")}
        />
      )}
      {mode === "typing" && (
        <TypingGame
          words={words.filter((w) => w.hasData)}
          onClose={() => setMode("list")}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mb-8">
          {/* Nút quay lại */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Quay lại thư viện
          </button>

          <div className="flex flex-col xl:flex-row justify-between gap-8 items-start">
            {/* Phần thông tin Deck */}
            <div className="w-full xl:w-auto flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold shadow-sm">
                  {deck.cefr_level}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  {deck.name}
                </h1>
              </div>

              <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl text-sm sm:text-base leading-relaxed mb-4">
                {deck.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <BookOpen size={16} />
                  <span>{words.length} từ vựng</span>
                </div>

                <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>

                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>Cập nhật: {formatISODate(deck.updated_at)}</span>
                </div>

                {missingCount > 0 && (
                  <>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md border border-amber-200/50 dark:border-amber-500/20">
                      <AlertCircle size={14} />
                      <span>{missingCount} từ chưa có dữ liệu</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Phần Action Buttons */}
            <div className="w-full xl:w-auto flex flex-wrap gap-3">
              {/* Nút Primary */}
              <button
                onClick={() => setMode("flashcard")}
                disabled={words.filter((w) => w.hasData).length === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
              >
                <PlayCircle size={18} /> Flashcard
              </button>

              {/* Các nút Secondary */}
              <div className="w-full sm:w-auto flex grid grid-cols-2 sm:flex sm:flex-row gap-3">
                <button
                  onClick={() => setMode("quiz")}
                  disabled={words.filter((w) => w.hasData).length < 4}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-transparent text-neutral-700 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Gamepad2 size={18} /> Trắc nghiệm
                </button>
                <button
                  onClick={() => setMode("speed")}
                  disabled={words.filter((w) => w.hasData).length < 4}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-transparent text-neutral-700 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} /> Tốc độ
                </button>
                <button
                  onClick={() => setMode("typing")}
                  disabled={words.filter((w) => w.hasData).length < 4}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-transparent text-neutral-700 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Keyboard size={18} /> Gõ nhanh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Banner: tải hàng loạt ── */}
        {missingCount > 0 && (
          <div className="mb-5 flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2.5 text-sm text-amber-700 dark:text-amber-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>
                <span className="font-bold">{missingCount} từ</span> chưa có dữ
                liệu từ điển. Tải để dùng được Flashcard &amp; Trắc nghiệm.
              </span>
            </div>
            <button
              onClick={handleFetchAll}
              disabled={isFetchingAny}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shrink-0"
            >
              {isFetchingAny ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <RefreshCw size={13} />
              )}
              Tải tất cả
            </button>
          </div>
        )}

        {/* ── List Controls (Sticky) ── */}
        <div className="sticky top-24 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => setShowWord(!showWord)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                showWord
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                  : "bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              {showWord ? <Eye size={14} /> : <EyeOff size={14} />} Từ vựng
            </button>
            <button
              onClick={() => setShowMeaning(!showMeaning)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                showMeaning
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                  : "bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              {showMeaning ? <Eye size={14} /> : <EyeOff size={14} />} Định
              nghĩa
            </button>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors mr-2"
          >
            <Shuffle size={14} /> Trộn danh sách
          </button>
        </div>

        {/* ── Word List ── */}
        <div className="space-y-3">
          {words.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-neutral-900/60 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-md transition-all duration-300 flex items-start sm:items-center gap-4"
            >
              {/* Audio Button */}
              <button
                onClick={(e) => playAudio(e, item)}
                className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-all shadow-sm shrink-0"
              >
                <Volume2 size={18} />
              </button>

              {/* Content Grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8 min-w-0">
                {/* Col 1: Word */}
                <div
                  className={`transition-all duration-500 ${
                    showWord
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 blur-sm select-none"
                  }`}
                >
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {item.word}
                    </h4>
                    {item.ipa && (
                      <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                        {item.ipa}
                      </span>
                    )}
                  </div>
                  {item.pos && (
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                      {item.pos}
                    </span>
                  )}
                </div>

                {/* Col 2: Meaning hoặc nút fetch */}
                <div
                  className={`transition-all duration-500 ${
                    showMeaning
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2 blur-sm select-none"
                  }`}
                >
                  {item.hasData ? (
                    <>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200 leading-snug mb-1">
                        {item.meaning}
                      </p>
                      {item.example && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                          "{item.example}"
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <FetchDataButton
                        wordText={item.word}
                        isFetching={!!fetchingIds[item.id]}
                        onFetched={() => handleFetchWordData(item)}
                      />
                      {errorIds[item.id] && (
                        <span className="text-[11px] text-red-400 dark:text-red-500 font-medium">
                          Không tìm thấy dữ liệu
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Option Menu */}
              {/* RIGHT: Speak Audio & View Details Link */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenModal(item.word)}
                  className="px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 
                  hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                  Chi tiết
                </button>

                <button
                  onClick={() => handleOpenSaveModal(item.word)}
                  className="px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 
                  hover:text-brand-500 dark:hover:text-brand-400 transition-colors border-l border-neutral-200 dark:border-neutral-700 pl-2"
                >
                  Lưu sổ tay
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {words.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-700 mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
              Bộ từ vựng này chưa có từ nào.
            </p>
          </div>
        )}
      </div>

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

export default VocabDeckDetails;
