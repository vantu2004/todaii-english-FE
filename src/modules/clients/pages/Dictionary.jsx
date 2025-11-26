import { useState, useEffect } from "react";
import { Loader2, Languages, BookA } from "lucide-react";
import {
  getWordByHeadword,
  getRawWord,
  getWordByGemini,
} from "../../../api/clients/dictionaryApi";

import SearchHistory from "../../../components/clients/dictionary_page/SearchHistory";
import DictDetailWord from "../../../components/clients/dictionary_page/DictDetailWord";
import RawDetailWord from "../../../components/clients/dictionary_page/RawDetailWord";
import AIChatBox from "../../../components/clients/dictionary_page/AIChatBox";
import SearchBar from "../../../components/clients/SearchBar";
import RelatedWords from "../../../components/clients/dictionary_page/RelatedWords";

import { motion, AnimatePresence } from "framer-motion";

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState("en-vi");

  // Data states
  const [dbEntry, setDbEntry] = useState([]);
  const [rawEntry, setRawEntry] = useState([]);
  const [error, setError] = useState(null);

  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("dict_history") || "[]")
  );

  const saveHistory = (term) => {
    setHistory((prev) => {
      if (prev.includes(term)) return prev;
      const newHistory = [term, ...prev].slice(0, 20);
      localStorage.setItem("dict_history", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const deleteHistoryItem = (wordToDelete, e) => {
    e.stopPropagation();

    const newHistory = history.filter((w) => w !== wordToDelete);
    setHistory(newHistory);

    localStorage.setItem("dict_history", JSON.stringify(newHistory));
  };

  const handleSearch = async (term) => {
    const wordToSearch = term || searchTerm;
    if (!wordToSearch.trim()) return;

    // Cập nhật UI input nếu search từ lịch sử/gợi ý
    if (term) setSearchTerm(term);

    setLoading(true);
    setDbEntry([]);
    setRawEntry([]);
    setError(null);

    try {
      if (searchMode === "en-vi") {
        const dbRes = await getWordByHeadword(wordToSearch);

        if (dbRes && dbRes.length > 0) {
          setDbEntry(dbRes);
          saveHistory(dbRes[0].headword);
        } else {
          // Fallback: Nếu không có Anh-Việt, thử tra Raw (Anh-Anh) để người dùng không bị trắng trang
          const rawRes = await getRawWord(wordToSearch);
          if (rawRes && rawRes.length > 0) {
            setRawEntry(rawRes);
            saveHistory(rawRes[0].word);
            // Có thể hiện thông báo nhỏ: "Chưa có bản dịch tiếng Việt, hiển thị tiếng Anh"
          } else {
            setError("Không tìm thấy từ này trong từ điển.");
          }
        }
      } else {
        const rawRes = await getRawWord(wordToSearch);

        if (rawRes && rawRes.length > 0) {
          setRawEntry(rawRes);
          saveHistory(rawRes[0].word);
        } else {
          setError("Không tìm thấy định nghĩa tiếng Anh cho từ này.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Đã có lỗi xảy ra khi tra cứu.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại search khi đổi chế độ (nếu đang có từ khóa)
  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [searchMode]);

  const handleRequestAI = async (word) => {
    setLoading(true);
    try {
      const aiRes = await getWordByGemini(word);
      if (aiRes && aiRes.length > 0) {
        setDbEntry(aiRes);
        setRawEntry(null);
      }
    } catch (err) {
      console.error(err);
      setError("Đã có lỗi xảy ra khi lấy dữ liệu AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="dictionary-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="min-h-full bg-neutral-50 pt-24 pb-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* --- SEARCH SECTION  --- */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* 1. Search Bar (Chiếm phần lớn không gian) */}
              <div className="flex-1 relative z-10">
                <SearchBar
                  value={searchTerm}
                  // Thay đổi placeholder ngắn gọn hơn khi ở giao diện ngang
                  placeholder={
                    searchMode === "en-vi"
                      ? "Nhập từ vựng tiếng Anh..."
                      : "Type a word to define..."
                  }
                  onSearch={handleSearch}
                />
              </div>

              {/* 2. Mode Switcher (Nằm bên phải) */}
              <div className="flex-shrink-0">
                <div className="bg-white p-1.5 rounded-full border border-neutral-200 shadow-sm flex items-center h-full">
                  <button
                    onClick={() => setSearchMode("en-vi")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      searchMode === "en-vi"
                        ? "bg-neutral-900 text-white shadow-md"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <Languages size={16} />
                    <span className="hidden sm:inline">Anh - Việt</span>
                    <span className="sm:hidden">En-Vi</span>
                  </button>

                  <button
                    onClick={() => setSearchMode("en-en")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                      searchMode === "en-en"
                        ? "bg-neutral-900 text-white shadow-md"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <BookA size={16} />
                    <span className="hidden sm:inline">Anh - Anh</span>
                    <span className="sm:hidden">En-En</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- MAIN GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar (History & Related) - 2/12 */}
            <div className="lg:col-span-2 hidden lg:block sticky top-24 space-y-6">
              <SearchHistory
                history={history}
                onSelectWord={handleSearch}
                onDeleteHistoryItem={deleteHistoryItem}
              />
              <RelatedWords
                word={dbEntry[0]?.headword || rawEntry[0]?.word}
                onSelectWord={handleSearch}
              />
            </div>

            {/* Center Content (Result) - 6/12 */}
            <div className="lg:col-span-6 min-h-[600px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                  <Loader2
                    className="animate-spin text-neutral-400 mb-3"
                    size={40}
                  />
                  <p className="text-neutral-500 text-sm font-medium animate-pulse">
                    Đang tra cứu...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-white p-12 rounded-3xl border border-neutral-100 text-center shadow-sm">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤔</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-neutral-500 text-sm">{error}</p>
                </div>
              ) : dbEntry.length > 0 ? (
                <DictDetailWord data={dbEntry} />
              ) : rawEntry.length > 0 ? (
                <RawDetailWord
                  data={rawEntry}
                  onRequestAI={handleRequestAI}
                  showAIButton={searchMode === "en-vi"}
                />
              ) : (
                /* Empty State */
                <div className="bg-white p-16 rounded-3xl border border-neutral-100 text-center shadow-sm">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookA size={32} className="text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    Từ điển trực tuyến
                  </h3>
                  <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                    Hãy nhập từ vựng vào ô tìm kiếm để xem định nghĩa, phát âm
                    và ví dụ.
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar (AI & Trends) - 4/12 */}
            <div className="lg:col-span-4 hidden lg:block sticky top-24">
              <AIChatBox />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dictionary;
