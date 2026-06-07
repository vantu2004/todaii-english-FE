import { useEffect, useState } from "react";
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
  Plus,
  Sparkles,
  Trash2,
  Loader2,
  BookDashed,
  BookOpen,
  Sidebar,
  Search,
  AlertTriangle,
} from "lucide-react";
import SearchBar from "@/components/clients/SearchBar";
import TodaiiDictResult from "@/components/clients/dictionary_page/TodaiiDictResult";
import FreeDictResult from "@/components/clients/dictionary_page/FreeDictResult";
import NotFoundState from "@/components/clients/dictionary_page/NotFoundState";
import { logError } from "@/utils/LogError";

const NoteEditor = ({ note, onToggleSidebar, isSidebarOpen }) => {
  const [savedWords, setSavedWords] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [apiSource, setApiSource] = useState("todaii");

  const [searchState, setSearchState] = useState({
    term: "",
    result: [],
    type: null, // 'todaii' | 'free'
    isSearching: false,
    error: null,
  });

  // Load Saved Words khi Note thay đổi
  useEffect(() => {
    if (!note?.id) return;

    const fetchWords = async () => {
      setLoadingSaved(true);
      setSearchState({ term: "", result: [], error: null });

      try {
        const words = await getWords(note.id);
        setSavedWords(words);
      } catch (error) {
        logError(error);
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchWords();
  }, [note?.id]);

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
      let result;
      if (source === "free") {
        result = await searchByFreeDictionaryApi(wordToSearch);
        if (result?.length) {
          setSearchState((prev) => ({
            ...prev,
            term: wordToSearch,
            result: result,
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
        result = await searchByTodaiiDictionary(wordToSearch, 1, 20);
        if (result?.result?.length) {
          setSearchState((prev) => ({
            ...prev,
            term: wordToSearch,
            result: result.result,
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
      console.error(error);
      const is404 = error.response && error.response.status === 404;
      setSearchState((prev) => ({
        ...prev,
        term: wordToSearch,
        error: is404 ? "NOT_FOUND" : "SERVER_ERROR",
      }));
    } finally {
      setSearchState((prev) => ({ ...prev, isSearching: false }));
    }
  };

  useEffect(() => {
    if (searchState.term) {
      handleSearch(searchState.term, apiSource);
    }
  }, [apiSource]);

  const handleAddWord = async () => {
    if (!searchState.result.length || !note) return;
    const entry = searchState.result[0];
    const headword = entry.word || entry.headword;

    // đảm bảo lưu 1 lần
    if (savedWords.some((w) => (w.headword || w.word) === headword)) {
      return;
    }

    const newWord = {
      id: entry.id || Date.now(), // Temp ID nếu là free
      headword,
      ipa: entry.pronounce?.us || entry.phonetic || "",
      definition:
        entry.content?.[0]?.means?.[0]?.mean ||
        entry.meanings?.[0]?.definitions?.[0]?.definition ||
        "",
    };
    setSavedWords([newWord, ...savedWords]);

    try {
      // chỉ lưu khi từ có trong DB (todaii)
      if (searchState.type === "todaii")
        await addWordToNotebook(note.id, entry.id);
    } catch (error) {
      console.error(error);

      setSavedWords((prev) =>
        prev.filter((w) => (w.headword || w.word) !== headword),
      );
    }
  };

  const handleRemoveWord = async (entryId, e) => {
    e.stopPropagation();

    const prev = [...savedWords];
    setSavedWords(savedWords.filter((w) => w.id !== entryId));

    try {
      await removeWordFromNotebook(note.id, entryId);
    } catch (error) {
      console.error(error);

      setSavedWords(prev);
    }
  };

  if (!note) return <EmptyNoteState />;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* LEFT COLUMN: SAVED LIST (35% Width) */}
      <div className="w-[35%] min-w-[300px] max-w-[400px] border-r border-neutral-200 bg-neutral-50 flex flex-col h-full dark:bg-neutral-900/50 dark:border-neutral-800">
        {/* Header */}
        <div className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 shrink-0 dark:bg-neutral-900 dark:border-neutral-800">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="text-neutral-400 hover:text-neutral-900 transition-colors dark:text-neutral-500 dark:hover:text-white"
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
              </p>
            </div>
          </div>
        </div>

        {/* List Content */}
        <SavedWordsList
          words={savedWords}
          loading={loadingSaved}
          activeWord={searchState.result[0]?.headword}
          onSelect={(w) => handleSearch(w.headword || w.word)}
          onRemove={handleRemoveWord}
        />
      </div>

      {/* RIGHT COLUMN: SEARCH & DETAIL (Flex-1) */}
      <div className="flex-1 bg-white flex flex-col h-full overflow-hidden relative dark:bg-neutral-950">
        {/* Search Bar Header */}
        <div className="p-4 border-b border-neutral-100 shrink-0 z-10 w-full dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <SearchBar
                value={searchState.term}
                onSearch={(term) => handleSearch(term, apiSource)}
                placeholder="Nhập từ vựng mới để thêm vào sổ tay..."
              />
            </div>

            {/* Segmented Control Toggle */}
            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-inner shrink-0">
              <button
                onClick={() => setApiSource("todaii")}
                className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  apiSource === "todaii"
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                    : "text-neutral-505 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Todaii API
              </button>
              <button
                onClick={() => setApiSource("free")}
                className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  apiSource === "free"
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                    : "text-neutral-505 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Free API
              </button>
            </div>
          </div>
        </div>

        {/* Detail Content Area */}
        <div className="flex-1 overflow-y-auto bg-white p-6 w-full dark:bg-neutral-950">
          <SearchResultPanel
            state={searchState}
            onAdd={handleAddWord}
            onWordClick={(w) => handleSearch(w, apiSource)}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;

const EmptyNoteState = () => (
  <div className="h-full flex flex-col items-center justify-center text-neutral-300 bg-white select-none dark:bg-neutral-950 dark:text-neutral-600">
    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4 dark:bg-neutral-800">
      <BookOpen size={32} className="opacity-50" />
    </div>
    <p className="text-lg font-medium text-neutral-400 dark:text-neutral-500">
      Select a vocabulary deck to start
    </p>
    <p className="text-sm text-neutral-300 dark:text-neutral-600">
      Or create a new one from the left sidebar
    </p>
  </div>
);

const SavedWordsList = ({ words, loading, onSelect, onRemove, activeWord }) => {
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-neutral-400 dark:text-neutral-500" />
      </div>
    );
  if (!words.length)
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-400 opacity-60 select-none dark:text-neutral-500">
        <BookDashed size={40} className="mb-3" />
        <p className="text-sm">Empty list</p>
      </div>
    );

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
      {words.map((word) => {
        const isActive = activeWord === (word.headword || word.word);
        return (
          <div
            key={word.id}
            onClick={() => onSelect(word)}
            className={`
              group p-3.5 rounded-xl border cursor-pointer transition-all relative
              ${
                isActive
                  ? "bg-white border-neutral-900 shadow-sm ring-1 ring-neutral-900/5 dark:bg-neutral-800 dark:border-white dark:ring-white/10"
                  : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm dark:bg-neutral-800/50 dark:border-neutral-700 dark:hover:border-neutral-600"
              }
            `}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <h3
                    className={`text-base font-bold truncate ${
                      isActive
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {word.headword || word.word}
                  </h3>
                  {word.ipa && (
                    <span className="text-[10px] text-neutral-500 font-mono bg-neutral-100 px-1.5 py-0.5 rounded dark:text-neutral-400 dark:bg-neutral-700">
                      {word.ipa}
                    </span>
                  )}
                </div>
                {word.definition && (
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed dark:text-neutral-400">
                    {word.definition}
                  </p>
                )}
              </div>

              <button
                onClick={(e) => onRemove(word.id, e)}
                className="p-1.5 rounded-md text-neutral-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0 dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                title="Delete word"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SearchResultPanel = ({ state, onAdd, onWordClick }) => {
  if (state.isSearching)
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-in fade-in duration-200">
        <Loader2
          className="animate-spin text-neutral-450 mb-2 dark:text-neutral-500"
          size={32}
        />
        <p className="text-sm text-neutral-400 animate-pulse dark:text-neutral-500">
          Đang tìm kiếm...
        </p>
      </div>
    );

  if (state.error === "NOT_FOUND")
    return <NotFoundState word={state.term} onSuggestionClick={onWordClick} />;

  if (state.error === "SERVER_ERROR")
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
          Đã xảy ra lỗi kết nối
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          Không thể kết nối đến máy chủ từ điển. Vui lòng kiểm tra lại đường
          truyền mạng và thử lại sau.
        </p>
      </div>
    );

  if (state.error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-red-50/50 rounded-3xl border border-red-100 dark:bg-red-900/20 dark:border-red-800 animate-in fade-in duration-200">
        <p className="text-red-600 font-semibold mb-1 dark:text-red-400 text-sm sm:text-base">
          Không tìm thấy từ vựng
        </p>
        <p className="text-xs text-red-400 dark:text-red-500">{state.error}</p>
      </div>
    );

  if (!state.result.length)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-300 select-none dark:text-neutral-600 animate-in fade-in duration-200">
        <Search size={48} className="mb-4 opacity-20" />
        <p className="text-sm">Nhập từ vựng để xem chi tiết kết quả tra cứu</p>
      </div>
    );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-neutral-900 text-white p-4 rounded-2xl shadow-lg dark:bg-neutral-850">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-neutral-350 uppercase tracking-wider dark:text-neutral-400">
              Kết quả tra cứu cho
            </p>
            <p className="text-sm font-bold dark:text-white">"{state.term}"</p>
          </div>
        </div>

        {state.type === "todaii" ? (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-200 px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm active:scale-95 dark:hover:bg-neutral-100"
          >
            <Plus size={16} />
            Lưu vào sổ tay
          </button>
        ) : (
          <span className="text-xs text-neutral-400 bg-neutral-800 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700">
            Chỉ hỗ trợ lưu từ Todaii API
          </span>
        )}
      </div>

      {/* Detail View */}
      <div>
        {state.type === "todaii" ? (
          <TodaiiDictResult
            data={{ result: state.result }}
            onWordClick={onWordClick}
          />
        ) : (
          <FreeDictResult data={state.result} onWordClick={onWordClick} />
        )}
      </div>
    </div>
  );
};
