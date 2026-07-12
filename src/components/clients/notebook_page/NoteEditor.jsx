import { useEffect, useState, useRef, useCallback } from "react";
import {
  getWords,
  addWordToNotebook,
  removeWordFromNotebook,
} from "@/api/clients/noteDictApi";
import {
  searchByFreeDictionaryApi,
  searchByTodaiiDictionary,
} from "@/api/clients/dictionaryApi";
import {
  Sidebar,
  Gamepad2,
  PlayCircle,
  Zap,
  Keyboard,
  ChevronDown,
} from "lucide-react";
import SearchBar from "@/components/clients/SearchBar";
import { logError } from "@/utils/LogError";
import { toggleLearnedWord, fetchLearnedWordIds } from "@/api/clients/userApi";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import toast from "react-hot-toast";
import SearchResultPanel from "./SearchResultPanel";
import SavedWordsList from "./SavedWordsList";
import EmptyNoteState from "./EmptyNoteState";
import FlashcardGame from "../vocab_deck_details_page/FlashcardGame";
import QuizGame from "../vocab_deck_details_page/QuizGame";
import SpeedRoundGame from "../vocab_deck_details_page/SpeedRoundGame";
import TypingGame from "../vocab_deck_details_page/TypingGame";

// ─────────────────────────────────────────────────────────────────────────────
// BE mới trả về DictionaryWord: { id, word, json_data }
// json_data là JSON string từ Todaii dict, có thể null nếu chưa có dữ liệu
//
// Cấu trúc json_data sau khi parse:
// { found, total, result: [{ id, word, pronounce, content, ... }] }
// ─────────────────────────────────────────────────────────────────────────────

// Parse json_data string → flat fields cần cho UI và games
const parseJsonData = (jsonDataStr) => {
  if (!jsonDataStr) return null;
  try {
    const parsed =
      typeof jsonDataStr === "string" ? JSON.parse(jsonDataStr) : jsonDataStr;
    if (!parsed?.found || !parsed?.result?.length) return null;

    // Tìm exact result theo word (result[] có thể chứa các dạng liên quan)
    // Nếu không có exact match thì lấy result[0]
    const result = parsed.result[0];

    const ipa =
      result.pronounce?.gb ||
      result.pronounce?.us ||
      result.pronounce?.base ||
      null;

    // Ưu tiên content phổ thông (không có field chuyên ngành)
    const mainContent =
      result.content?.find((c) => !c.field) ?? result.content?.[0];

    const pos = mainContent?.kind || null;
    const meaning = mainContent?.means?.[0]?.mean || null;
    const example =
      mainContent?.means?.[0]?.examples?.[0]?.e ||
      mainContent?.means?.[1]?.examples?.[0]?.e ||
      null;

    return { ipa, pos, meaning, example };
  } catch {
    return null;
  }
};

// Map DictionaryWord từ BE → object chuẩn cho UI + games
// BE: { id, word, json_data }
const mapDictionaryWord = (w) => {
  const parsed = parseJsonData(w.json_data);
  return {
    id: w.id,
    word: w.word, // field chuẩn cho games
    ipa: parsed?.ipa || null,
    pos: parsed?.pos || null,
    meaning: parsed?.meaning || null, // field chuẩn cho games
    example: parsed?.example || null,
    audio_url: w.audio_url || null,
    hasData: !!parsed?.meaning, // chỉ true khi parse được nghĩa
  };
};

// Tìm exact-match result trong result[] của Todaii API
// API thường trả về nhiều kết quả liên quan (map → mapping, mapped...)
const findExactResult = (results, word) => {
  if (!results?.length) return null;
  const normalized = word.trim().toLowerCase();
  return (
    results.find((r) => r.word?.toLowerCase() === normalized) ?? results[0]
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const NoteEditor = ({ note, onToggleSidebar, isSidebarOpen }) => {
  const [savedWords, setSavedWords] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [apiSource, setApiSource] = useState("todaii");
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [mode, setMode] = useState("list");

  // Per-word fetch state
  const [fetchingIds, setFetchingIds] = useState({});
  const [errorIds, setErrorIds] = useState({});

  const { isLoggedIn } = useClientAuthContext();
  const [learnedWordIds, setLearnedWordIds] = useState([]);
  const [togglingWordIds, setTogglingWordIds] = useState({});

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

  const dropdownRef = useRef(null);

  const [searchState, setSearchState] = useState({
    term: "",
    result: [],
    type: null, // 'todaii' | 'free'
    isSearching: false,
    error: null,
  });

  // Đóng game menu khi click ngoài
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowGameMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Load words khi note thay đổi
  useEffect(() => {
    if (!note?.id) return;
    const fetchWords = async () => {
      setLoadingSaved(true);
      setSearchState({
        term: "",
        result: [],
        error: null,
        type: null,
        isSearching: false,
      });
      setFetchingIds({});
      setErrorIds({});
      try {
        // BE trả về List<DictionaryWord>: [{ id, word, json_data }]
        const words = await getWords(note.id);
        setSavedWords((words || []).map(mapDictionaryWord));
      } catch (error) {
        logError(error);
      } finally {
        setLoadingSaved(false);
      }
    };
    fetchWords();
  }, [note?.id]);

  // ── Fetch dict data cho 1 từ chưa có json_data ───────────────────────────
  const handleFetchWordData = useCallback(async (wordItem) => {
    setFetchingIds((prev) => ({ ...prev, [wordItem.id]: true }));
    setErrorIds((prev) => ({ ...prev, [wordItem.id]: false }));
    try {
      // size=5 để tăng khả năng có exact match
      const res = await searchByTodaiiDictionary(wordItem.word, 1, 5);
      const exactResult = findExactResult(res?.result, wordItem.word);
      const parsed = parseJsonData(
        JSON.stringify({
          found: true,
          total: 1,
          result: exactResult ? [exactResult] : [],
        }),
      );

      if (parsed?.meaning) {
        setSavedWords((prev) =>
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
        setErrorIds((prev) => ({ ...prev, [wordItem.id]: true }));
      }
    } catch (err) {
      logError(err);
      setErrorIds((prev) => ({ ...prev, [wordItem.id]: true }));
    } finally {
      setFetchingIds((prev) => ({ ...prev, [wordItem.id]: false }));
    }
  }, []);

  // ── Fetch tất cả từ chưa có data (tuần tự) ───────────────────────────────
  const handleFetchAll = useCallback(async () => {
    const missing = savedWords.filter((w) => !w.hasData);
    for (const w of missing) {
      await handleFetchWordData(w);
    }
  }, [savedWords, handleFetchWordData]);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = async (term, source = apiSource) => {
    const wordToSearch = term || searchState.term;
    if (!wordToSearch.trim()) return;

    setSearchState((prev) => ({
      ...prev,
      term: wordToSearch,
      isSearching: true,
      result: [],
      error: null,
    }));

    try {
      if (source === "free") {
        const result = await searchByFreeDictionaryApi(wordToSearch);
        if (result?.length) {
          setSearchState((prev) => ({
            ...prev,
            term: wordToSearch,
            result,
            type: "free",
          }));
        } else {
          setSearchState((prev) => ({
            ...prev,
            term: wordToSearch,
            error: "NOT_FOUND",
          }));
        }
      } else {
        const res = await searchByTodaiiDictionary(wordToSearch, 1, 20);
        if (res?.result?.length) {
          setSearchState((prev) => ({
            ...prev,
            term: wordToSearch,
            result: res.result, // result[] items trực tiếp
            type: "todaii",
          }));
        } else {
          setSearchState((prev) => ({
            ...prev,
            term: wordToSearch,
            error: "NOT_FOUND",
          }));
        }
      }
    } catch (error) {
      const is404 = error.response?.status === 404;
      setSearchState((prev) => ({
        ...prev,
        term: wordToSearch,
        error: is404 ? "NOT_FOUND" : "SERVER_ERROR",
      }));
    } finally {
      setSearchState((prev) => ({ ...prev, isSearching: false }));
    }
  };

  // Re-search khi đổi nguồn API
  useEffect(() => {
    if (searchState.term) handleSearch(searchState.term, apiSource);
  }, [apiSource]); // eslint-disable-line

  // ── Add word vào notebook ─────────────────────────────────────────────────
  const handleAddWord = async () => {
    if (!searchState.result.length || !note) return;

    // Với todaii: tìm exact match để add đúng từ
    const entry =
      searchState.type === "todaii"
        ? (findExactResult(searchState.result, searchState.term) ??
          searchState.result[0])
        : searchState.result[0];

    const wordText = entry.word || entry.headword;

    if (savedWords.some((w) => w.word === wordText)) return;

    // Parse ngay để hiển thị data trong list trước khi BE confirm
    const parsed =
      searchState.type === "todaii"
        ? parseJsonData(
            JSON.stringify({
              found: true,
              total: 1,
              result: [entry],
            }),
          )
        : null;

    const optimisticWord = {
      id: entry.id || Date.now(),
      word: wordText,
      ipa: parsed?.ipa || entry.pronounce?.gb || entry.pronounce?.us || null,
      pos: parsed?.pos || null,
      meaning:
        parsed?.meaning ||
        entry.meanings?.[0]?.definitions?.[0]?.definition ||
        null,
      example: parsed?.example || null,
      audio_url: null,
      hasData: !!parsed?.meaning,
    };

    setSavedWords([optimisticWord, ...savedWords]);

    try {
      if (searchState.type === "todaii") {
        await addWordToNotebook(note.id, wordText);
      }
    } catch (error) {
      logError(error);
      setSavedWords((prev) => prev.filter((w) => w.word !== wordText));
    }
  };

  // ── Remove word ───────────────────────────────────────────────────────────
  const handleRemoveWord = async (entryId, e) => {
    e.stopPropagation();
    const prev = [...savedWords];
    setSavedWords(savedWords.filter((w) => w.id !== entryId));
    try {
      await removeWordFromNotebook(note.id, entryId);
    } catch (error) {
      logError(error);
      setSavedWords(prev);
    }
  };

  const handlePlayGame = (gameMode) => {
    setShowGameMenu(false);
    setMode(gameMode);
  };

  // Words đủ điều kiện cho games (đã có meaning)
  const wordsWithData = savedWords.filter((w) => w.hasData);
  const missingCount = savedWords.filter((w) => !w.hasData).length;

  if (!note) return <EmptyNoteState />;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* ── LEFT COLUMN: SAVED LIST ── */}
      <div className="w-80 border-r border-neutral-200 bg-neutral-50 flex flex-col h-full dark:bg-neutral-900/50 dark:border-neutral-800">
        {/* Header */}
        <div className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 shrink-0 dark:bg-neutral-900 dark:border-neutral-800 relative z-20">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <button
              onClick={onToggleSidebar}
              className="text-neutral-400 hover:text-neutral-900 transition-colors dark:text-neutral-500 dark:hover:text-white shrink-0"
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              <Sidebar size={18} />
            </button>
            <div className="min-w-0">
              <h2
                className="text-sm font-bold text-neutral-900 truncate dark:text-white"
                title={note.name}
              >
                {note.name}
              </h2>
              <p className="text-xs text-neutral-500 font-medium dark:text-neutral-400">
                {savedWords.length} words
                {missingCount > 0 && (
                  <span className="text-amber-500 ml-1">
                    · {missingCount} chưa có data
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Game Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setShowGameMenu(!showGameMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-xs font-bold"
            >
              <Gamepad2 size={16} />
              <span className="hidden xl:inline">Luyện tập</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${showGameMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showGameMenu && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-lg shadow-md overflow-hidden py-1">
                <div className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800">
                  Chọn chế độ
                </div>
                {[
                  {
                    key: "flashcard",
                    icon: PlayCircle,
                    label: "Flashcard",
                    color: "text-blue-500",
                    min: 1,
                  },
                  {
                    key: "quiz",
                    icon: Gamepad2,
                    label: "Trắc nghiệm",
                    color: "text-emerald-500",
                    min: 4,
                  },
                  {
                    key: "speed",
                    icon: Zap,
                    label: "Tốc độ",
                    color: "text-amber-500",
                    min: 4,
                  },
                  {
                    key: "typing",
                    icon: Keyboard,
                    label: "Gõ nhanh",
                    color: "text-purple-500",
                    min: 1,
                  },
                ].map(({ key, icon: Icon, label, color, min }) => (
                  <button
                    key={key}
                    onClick={() => handlePlayGame(key)}
                    disabled={wordsWithData.length < min}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
                  >
                    <Icon size={16} className={color} />
                    {label}
                  </button>
                ))}
                {wordsWithData.length < 4 && (
                  <p className="px-3 py-2 mt-1 bg-amber-50 dark:bg-amber-900/20 text-[10px] text-amber-600 dark:text-amber-400 text-center">
                    Cần ít nhất 4 từ có dữ liệu để mở khóa tất cả chế độ
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <SavedWordsList
          words={savedWords}
          loading={loadingSaved}
          activeWord={
            searchState.type === "todaii"
              ? findExactResult(searchState.result, searchState.term)?.word
              : searchState.result[0]?.word
          }
          onSelect={(w) => handleSearch(w.word)}
          onRemove={handleRemoveWord}
          onFetchWord={handleFetchWordData}
          onFetchAll={handleFetchAll}
          fetchingIds={fetchingIds}
          errorIds={errorIds}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
        />
      </div>

      {/* ── RIGHT COLUMN: SEARCH & DETAIL ── */}
      <div className="flex-1 bg-white flex flex-col h-full overflow-hidden relative dark:bg-neutral-950">
        <div className="p-4 border-b border-neutral-100 shrink-0 z-10 w-full dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <SearchBar
                value={searchState.term}
                onSearch={(term) => handleSearch(term, apiSource)}
                placeholder="Nhập từ vựng mới để thêm vào sổ tay..."
              />
            </div>
            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow-inner shrink-0">
              {[
                { key: "todaii", label: "Todaii API" },
                { key: "free", label: "Free API" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setApiSource(key)}
                  className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    apiSource === key
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-6 w-full dark:bg-neutral-950">
          <SearchResultPanel
            state={searchState}
            onAdd={handleAddWord}
            onWordClick={(w) => handleSearch(w, apiSource)}
          />
        </div>
      </div>

      {/* ── Games ── */}
      {mode === "flashcard" && (
        <FlashcardGame
          words={wordsWithData}
          onClose={() => setMode("list")}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
        />
      )}
      {mode === "quiz" && (
        <QuizGame
          words={wordsWithData}
          onClose={() => setMode("list")}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
        />
      )}
      {mode === "speed" && (
        <SpeedRoundGame
          words={wordsWithData}
          onClose={() => setMode("list")}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
        />
      )}
      {mode === "typing" && (
        <TypingGame
          words={wordsWithData}
          onClose={() => setMode("list")}
          learnedWordIds={learnedWordIds}
          onToggleLearn={handleToggleLearn}
          togglingWordIds={togglingWordIds}
        />
      )}
    </div>
  );
};

export default NoteEditor;
