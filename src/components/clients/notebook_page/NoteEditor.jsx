import { useEffect, useState } from "react";
import {
  getWords,
  addWordToNotebook,
  removeWordFromNotebook,
} from "../../../api/clients/noteDictApi";
import {
  getWordByHeadword,
  getRawWord,
  getWordByGemini,
} from "../../../api/clients/dictionaryApi";
import {
  Plus,
  Sparkles,
  Trash2,
  Loader2,
  BookDashed,
  BookOpen,
  Sidebar,
  Search,
} from "lucide-react";

// Components UI Reuse
import SearchBar from "../../../components/clients/SearchBar";
import DictDetailWord from "../../../components/clients/dictionary_page/DictDetailWord";
import RawDetailWord from "../../../components/clients/dictionary_page/RawDetailWord";
import RelatedWords from "../../../components/clients/dictionary_page/RelatedWords";

export default function NoteEditor({ note, onToggleSidebar, isSidebarOpen }) {
  // --- STATE ---
  const [savedWords, setSavedWords] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Search State
  const [searchState, setSearchState] = useState({
    term: "",
    result: [],
    type: null, // 'db' | 'raw'
    isSearching: false,
    error: null,
  });

  // --- EFFECTS ---
  // 1. Load Saved Words khi Note thay đổi
  useEffect(() => {
    if (!note) return;
    setLoadingSaved(true);
    setSearchState((prev) => ({ ...prev, term: "", result: [], error: null }));

    getWords(note.id)
      .then(setSavedWords)
      .catch((err) => console.error(err))
      .finally(() => setLoadingSaved(false));
  }, [note?.id]);

  // --- HANDLERS ---
  // 2. Xử lý Search
  const handleSearch = async (term) => {
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
      // Ưu tiên tìm trong DB
      const dbRes = await getWordByHeadword(wordToSearch);
      if (dbRes?.length) {
        setSearchState((prev) => ({ ...prev, result: dbRes, type: "db" }));
      } else {
        // Fallback sang Raw API
        const rawRes = await getRawWord(wordToSearch);
        if (rawRes?.length) {
          setSearchState((prev) => ({ ...prev, result: rawRes, type: "raw" }));
        } else {
          setSearchState((prev) => ({
            ...prev,
            error: "Không tìm thấy từ này trong từ điển.",
          }));
        }
      }
    } catch {
      setSearchState((prev) => ({
        ...prev,
        error: "Lỗi kết nối tới máy chủ.",
      }));
    } finally {
      setSearchState((prev) => ({ ...prev, isSearching: false }));
    }
  };

  // 3. Thêm từ vào Note
  const handleAddWord = async () => {
    if (!searchState.result.length || !note) return;
    const entry = searchState.result[0];
    const headword = entry.headword || entry.word;

    if (savedWords.some((w) => (w.headword || w.word) === headword)) {
      return alert("Từ này đã có trong danh sách!");
    }

    // Optimistic Update UI
    const newWord = {
      id: entry.id || Date.now(), // Temp ID nếu là raw
      headword,
      ipa: entry.ipa || entry.phonetic,
      definition:
        entry.senses?.[0]?.meaning ||
        entry.meanings?.[0]?.definitions?.[0]?.definition,
    };
    setSavedWords([newWord, ...savedWords]);

    try {
      if (searchState.type === "db") await addWordToNotebook(note.id, entry.id);
      // TODO: Handle raw word saving if API supports it
    } catch {
      alert("Lỗi lưu từ");
      setSavedWords((prev) =>
        prev.filter((w) => (w.headword || w.word) !== headword)
      );
    }
  };

  // 4. Xóa từ khỏi Note
  const handleRemoveWord = async (entryId, e) => {
    e.stopPropagation();
    if (!confirm("Xóa từ này khỏi bộ từ vựng?")) return;

    const prev = [...savedWords];
    setSavedWords(savedWords.filter((w) => w.id !== entryId));

    try {
      await removeWordFromNotebook(note.id, entryId);
    } catch {
      setSavedWords(prev);
    }
  };

  // 5. Dùng AI dịch từ
  const handleRequestAI = async (word) => {
    setSearchState((prev) => ({ ...prev, isSearching: true }));
    try {
      const res = await getWordByGemini(word);
      if (res?.length)
        setSearchState((prev) => ({ ...prev, result: res, type: "db" }));
    } catch {
      alert("Lỗi AI xử lý");
    } finally {
      setSearchState((prev) => ({ ...prev, isSearching: false }));
    }
  };

  // --- RENDER ---
  if (!note) return <EmptyNoteState />;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* LEFT COLUMN: SAVED LIST (35% Width) */}
      <div className="w-[35%] min-w-[300px] max-w-[400px] border-r border-neutral-200 bg-neutral-50 flex flex-col h-full">
        {/* Header */}
        <div className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="text-neutral-400 hover:text-neutral-900 transition-colors"
              title={isSidebarOpen ? "Đóng Sidebar" : "Mở Sidebar"}
            >
              <Sidebar size={18} />
            </button>
            <div className="min-w-0">
              <h2
                className="text-sm font-bold text-neutral-900 truncate"
                title={note.name}
              >
                {note.name}
              </h2>
              <p className="text-xs text-neutral-500 font-medium">
                {savedWords.length} từ vựng
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
      <div className="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
        {/* Search Bar Header */}
        <div className="p-4 border-b border-neutral-100 shrink-0 z-10 w-full">
          <SearchBar
            value={searchState.term}
            onSearch={handleSearch}
            placeholder="Nhập từ vựng mới để thêm vào bộ..."
          />
        </div>

        {/* Detail Content Area */}
        <div className="flex-1 overflow-y-auto bg-white p-6 w-full">
          <SearchResultPanel
            state={searchState}
            onAdd={handleAddWord}
            onRequestAI={handleRequestAI}
          />
        </div>

        {/* Footer: Related Words (Chỉ hiện khi có content) */}
        {(searchState.result.length > 0 || savedWords.length > 0) && (
          <div className="h-40 border-t border-neutral-100 bg-neutral-50/50 shrink-0 overflow-hidden p-4 w-full">
            <RelatedWords
              word={
                searchState.result[0]?.headword ||
                savedWords[0]?.headword ||
                "learn"
              }
              onSelectWord={handleSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (UI only) ---

const EmptyNoteState = () => (
  <div className="h-full flex flex-col items-center justify-center text-neutral-300 bg-white select-none">
    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
      <BookOpen size={32} className="opacity-50" />
    </div>
    <p className="text-lg font-medium text-neutral-400">
      Chọn một bộ từ vựng để bắt đầu
    </p>
    <p className="text-sm text-neutral-300">Hoặc tạo mới từ thanh bên trái</p>
  </div>
);

const SavedWordsList = ({ words, loading, onSelect, onRemove, activeWord }) => {
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-neutral-400" />
      </div>
    );
  if (!words.length)
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-400 opacity-60 select-none">
        <BookDashed size={40} className="mb-3" />
        <p className="text-sm">Danh sách trống</p>
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
                  ? "bg-white border-neutral-900 shadow-sm ring-1 ring-neutral-900/5"
                  : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
              }
            `}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <h3
                    className={`text-base font-bold truncate ${
                      isActive ? "text-neutral-900" : "text-neutral-700"
                    }`}
                  >
                    {word.headword || word.word}
                  </h3>
                  {word.ipa && (
                    <span className="text-[10px] text-neutral-500 font-mono bg-neutral-100 px-1.5 py-0.5 rounded">
                      {word.ipa}
                    </span>
                  )}
                </div>
                {word.definition && (
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {word.definition}
                  </p>
                )}
              </div>

              <button
                onClick={(e) => onRemove(word.id, e)}
                className="p-1.5 rounded-md text-neutral-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                title="Xóa từ"
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

const SearchResultPanel = ({ state, onAdd, onRequestAI }) => {
  if (state.isSearching)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-neutral-400 mb-2" size={32} />
        <p className="text-sm text-neutral-400 animate-pulse">
          Đang tra cứu...
        </p>
      </div>
    );

  if (state.error)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6 bg-red-50 rounded-3xl border border-red-100">
        <p className="text-red-600 font-medium mb-1">Không tìm thấy kết quả</p>
        <p className="text-xs text-red-400">{state.error}</p>
      </div>
    );

  if (!state.result.length)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-300 select-none">
        <Search size={48} className="mb-4 opacity-20" />
        <p className="text-sm">Nhập từ khóa để xem chi tiết</p>
      </div>
    );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-neutral-900 text-white p-4 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-300 uppercase tracking-wider">
              Kết quả cho
            </p>
            <p className="text-sm font-bold">"{state.term}"</p>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-200 px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm active:scale-95"
        >
          <Plus size={16} />
          Lưu vào bộ từ
        </button>
      </div>

      {/* Detail View */}
      <div>
        {state.type === "db" ? (
          <DictDetailWord data={state.result} />
        ) : (
          <RawDetailWord
            data={state.result}
            onRequestAI={onRequestAI}
            showAIButton={true}
          />
        )}
      </div>
    </div>
  );
};
