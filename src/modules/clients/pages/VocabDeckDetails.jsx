import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Check,
} from "lucide-react";
import { getVocabDeckById } from "@/api/clients/vocabDeckApi";
import { searchByTodaiiDictionary } from "@/api/clients/dictionaryApi";
import { incrementStudyItem } from "@/api/clients/studyLogApi";
import { toggleLearnedWord, fetchLearnedWordIds } from "@/api/clients/userApi";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import toast from "react-hot-toast";
import { STUDY_EVENTS, emitStudyEvent } from "@/utils/studyEvents";
import FlashcardGame from "@/components/clients/vocab_deck_details_page/FlashcardGame";
import QuizGame from "@/components/clients/vocab_deck_details_page/QuizGame";
import { formatISODate } from "@/utils/FormatDate";
import TypingGame from "@/components/clients/vocab_deck_details_page/TypingGame";
import SpeedRoundGame from "@/components/clients/vocab_deck_details_page/SpeedRoundGame";
import { loadVoices, handleSpeak } from "@/utils/ReactSpeechKit";
import DictionaryModal from "@/components/clients/DictionaryModal";
import SaveToNotebookModal from "@/components/clients/SaveToNotebookModal";
import GameScopeModal from "@/components/clients/vocab_deck_details_page/GameScopeModal";

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

  const { isLoggedIn } = useClientAuthContext();

  const [learnedWordIds, setLearnedWordIds] = useState([]);
  const [togglingWordIds, setTogglingWordIds] = useState({});
  const [scopeModalOpen, setScopeModalOpen] = useState(false);
  const [pendingGameMode, setPendingGameMode] = useState("");
  const [filteredGameWords, setFilteredGameWords] = useState([]);

  useEffect(() => {
    const fetchLearned = async () => {
      if (!isLoggedIn) return;
      try {
        const ids = await fetchLearnedWordIds();
        setLearnedWordIds(ids || []);
      } catch (err) {
        console.error("Failed to load learned words", err);
      }
    };
    fetchLearned();
  }, [isLoggedIn]);

  const handleToggleLearn = async (wordId) => {
    if (!isLoggedIn) {
      toast.error("Bạn cần đăng nhập để đánh dấu từ đã học!");
      return;
    }
    setTogglingWordIds((prev) => ({ ...prev, [wordId]: true }));
    try {
      await toggleLearnedWord(wordId);
      const isCurrentlyLearned = learnedWordIds.includes(wordId);
      setLearnedWordIds((prev) =>
        prev.includes(wordId)
          ? prev.filter((id) => id !== wordId)
          : [...prev, wordId],
      );
      if (isCurrentlyLearned) {
        toast.success("Đã hủy đánh dấu đã học.");
      } else {
        toast.success("Đã đánh dấu từ vựng này là đã học!");
      }
    } catch (err) {
      console.error("Failed to toggle learned word", err);
      toast.error("Đã xảy ra lỗi khi lưu tiến độ. Vui lòng thử lại!");
    } finally {
      setTogglingWordIds((prev) => ({ ...prev, [wordId]: false }));
    }
  };

  const handleStartGameFlow = (gameMode) => {
    setPendingGameMode(gameMode);
    setScopeModalOpen(true);
  };

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
    if (id) {
      incrementStudyItem("VOCAB_DECK")
        .then(() => {
          emitStudyEvent(STUDY_EVENTS.ITEM_INCREMENTED);
        })
        .catch((err) =>
          console.error("Increment vocab deck study item error:", err),
        );
    }
  }, [id]);

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
  const wordsWithData = useMemo(() => words.filter((w) => w.hasData), [words]);
  const missingCount = useMemo(() => words.filter((w) => !w.hasData).length, [words]);
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
          words={filteredGameWords}
          onClose={() => setMode("list")}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
        />
      )}
      {mode === "quiz" && (
        <QuizGame
          words={filteredGameWords}
          onClose={() => setMode("list")}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
        />
      )}
      {mode === "speed" && (
        <SpeedRoundGame
          words={filteredGameWords}
          onClose={() => setMode("list")}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
        />
      )}
      {mode === "typing" && (
        <TypingGame
          words={filteredGameWords}
          onClose={() => setMode("list")}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
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

                <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600"></div>

                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm font-semibold">
                  <BookMarked size={14} className="text-emerald-500" />
                  <span>
                    Đã học:{" "}
                    {words.filter((w) => learnedWordIds.includes(w.id)).length}/
                    {words.length} từ
                  </span>
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
            <div className="w-full xl:w-auto flex flex-wrap gap-2">
              {/* Nút Primary */}
              <button
                onClick={() => handleStartGameFlow("flashcard")}
                disabled={wordsWithData.length === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircle size={16} /> Flashcard
              </button>

              {/* Các nút Secondary */}
              <div className="w-full sm:w-auto flex grid grid-cols-2 sm:flex sm:flex-row gap-2">
                <button
                  onClick={() => handleStartGameFlow("quiz")}
                  disabled={wordsWithData.length < 4}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-transparent text-neutral-700 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Gamepad2 size={16} /> Trắc nghiệm
                </button>
                <button
                  onClick={() => handleStartGameFlow("speed")}
                  disabled={wordsWithData.length < 4}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-transparent text-neutral-700 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={16} /> Tốc độ
                </button>
                <button
                  onClick={() => handleStartGameFlow("typing")}
                  disabled={wordsWithData.length < 4}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-transparent text-neutral-700 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Keyboard size={16} /> Gõ nhanh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Banner: tải hàng loạt ── */}
        {missingCount > 0 && (
          <div className="mb-4 flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
              <AlertCircle size={14} className="shrink-0" />
              <span>
                <span className="font-bold">{missingCount} từ</span> chưa có dữ
                liệu từ điển. Tải để dùng được Flashcard &amp; Trắc nghiệm.
              </span>
            </div>
            <button
              onClick={handleFetchAll}
              disabled={isFetchingAny}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors shrink-0"
            >
              {isFetchingAny ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              Tải tất cả
            </button>
          </div>
        )}

        {/* ── List Controls (Sticky) ── */}
        <div className="sticky top-20 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 px-1">
            <button
              onClick={() => setShowWord(!showWord)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
                showWord
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                  : "bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              {showWord ? <Eye size={12} /> : <EyeOff size={12} />} Từ vựng
            </button>
            <button
              onClick={() => setShowMeaning(!showMeaning)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
                showMeaning
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                  : "bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              {showMeaning ? <Eye size={12} /> : <EyeOff size={12} />} Định
              nghĩa
            </button>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors mr-1"
          >
            <Shuffle size={12} /> Trộn danh sách
          </button>
        </div>

        {/* ── Word List ── */}
        <div className="space-y-2">
          {words.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-neutral-900/60 p-4 rounded-lg border border-gray-200 dark:border-neutral-800/80 hover:border-gray-400 dark:hover:border-neutral-600 transition-all flex items-start sm:items-center gap-3"
            >
              {/* Audio Button */}
              <button
                onClick={(e) => playAudio(e, item)}
                className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-all shrink-0"
              >
                <Volume2 size={16} />
              </button>

              {/* Content Grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-6 min-w-0">
                {/* Col 1: Word */}
                <div
                  className={`transition-all duration-300 ${
                    showWord
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 blur-sm select-none"
                  }`}
                >
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="text-base font-semibold text-neutral-900 dark:text-white">
                      {item.word}
                    </h4>
                    {item.ipa && (
                      <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                        {item.ipa}
                      </span>
                    )}
                  </div>
                  {item.pos && (
                    <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-800 px-1.5 py-0.5 rounded-sm">
                      {item.pos}
                    </span>
                  )}
                </div>

                {/* Col 2: Meaning hoặc nút fetch */}
                <div
                  className={`transition-all duration-300 ${
                    showMeaning
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2 blur-sm select-none"
                  }`}
                >
                  {item.hasData ? (
                    <>
                      <p className="font-medium text-neutral-800 dark:text-neutral-200 leading-snug mb-0.5 text-sm">
                        {item.meaning}
                      </p>
                      {item.example && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                          "{item.example}"
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <FetchDataButton
                        wordText={item.word}
                        isFetching={!!fetchingIds[item.id]}
                        onFetched={() => handleFetchWordData(item)}
                      />
                      {errorIds[item.id] && (
                        <span className="text-[10px] text-red-400 dark:text-red-500 font-medium">
                          Không tìm thấy dữ liệu
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Option Menu */}
              {/* RIGHT: Speak Audio & View Details Link */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleLearn(item.id)}
                  disabled={togglingWordIds[item.id]}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                    togglingWordIds[item.id]
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } ${
                    learnedWordIds.includes(item.id)
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-100"
                      : "bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-emerald-500 hover:text-emerald-500"
                  }`}
                >
                  <Check
                    size={12}
                    className={
                      learnedWordIds.includes(item.id)
                        ? "text-emerald-600 dark:text-emerald-400"
                        : ""
                    }
                  />
                  {learnedWordIds.includes(item.id) ? "Đã học" : "Chưa học"}
                </button>

                <button
                  onClick={() => handleOpenModal(item.word)}
                  className="px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 
                  hover:text-brand-500 dark:hover:text-brand-400 transition-colors border-l border-neutral-200 dark:border-neutral-700 pl-2"
                >
                  Chi tiết
                </button>

                <button
                  onClick={() => handleOpenSaveModal(item.word)}
                  className="px-2 py-1 text-xs font-medium text-neutral-500 dark:text-neutral-400 
                  hover:text-brand-500 dark:hover:text-brand-400 transition-colors border-l border-neutral-200 dark:border-neutral-700 pl-2"
                >
                  Lưu
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {words.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-10 w-10 text-neutral-300 dark:text-neutral-700 mb-2" />
            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">
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

      <GameScopeModal
        isOpen={scopeModalOpen}
        onClose={() => setScopeModalOpen(false)}
        words={wordsWithData}
        learnedWordIds={learnedWordIds}
        gameMode={pendingGameMode}
        onStart={(filteredWords) => {
          setFilteredGameWords(filteredWords);
          setMode(pendingGameMode);
          setScopeModalOpen(false);
        }}
      />
    </div>
  );
};

export default VocabDeckDetails;
