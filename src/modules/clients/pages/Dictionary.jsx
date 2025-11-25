// src/pages/client/DictionaryPage.jsx
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  getWordByHeadword,
  getRawWord,
  getWordByGemini,
} from "../../../api/clients/dictionaryApi";

import SearchHistory from "../../../components/clients/dictionary_page/SearchHistory";
import DictDetailWord from "../../../components/clients/dictionary_page/DictDetailWord";
import RawDetailWord from "../../../components/clients/dictionary_page/RawDetailWord";
import RightSidebar from "../../../components/clients/dictionary_page/RightSidebar";
import SearchBar from "../../../components/clients/SearchBar";

import { motion, AnimatePresence } from "framer-motion";

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Data states
  const [dbEntry, setDbEntry] = useState(null);
  const [rawEntry, setRawEntry] = useState(null);
  const [error, setError] = useState(null);

  // Xử lý tìm kiếm chính
  const handleSearch = async (term) => {
    if (!term.trim()) return;

    setLoading(true);
    setDbEntry(null);
    setRawEntry(null);
    setError(null);
    setSearchTerm(term);

    // Lưu vào LocalStorage
    const history = JSON.parse(localStorage.getItem("dict_history") || "[]");
    if (!history.includes(term)) {
      localStorage.setItem(
        "dict_history",
        JSON.stringify([term, ...history].slice(0, 20))
      );
    }

    try {
      // 1. Thử tìm trong Database (Anh-Việt)
      const dbRes = await getWordByHeadword(term);
      if (dbRes && dbRes.length > 0) {
        setDbEntry(dbRes[0]); // Lấy kết quả đầu tiên
      } else {
        // 2. Nếu không có, tìm Raw (Anh-Anh)
        const rawRes = await getRawWord(term);
        if (rawRes && rawRes.length > 0) {
          setRawEntry(rawRes);
        } else {
          setError("Không tìm thấy từ này.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tra cứu.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi bấm nút "Dùng AI Dịch"
  const handleRequestAI = async (word) => {
    setLoading(true);
    try {
      const aiRes = await getWordByGemini(word);
      if (aiRes && aiRes.length > 0) {
        setDbEntry(aiRes[0]);
        setRawEntry(null); // Ẩn Raw đi để hiện DB (do AI tạo ra)
      }
    } catch (err) {
      console.error(err);
      alert("AI đang bận, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="search-results-page"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
        className="min-h-full bg-neutral-50 pt-24 pb-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Search Bar */}
          <div className="max-w-7xl mx-auto mb-10">
            <div className="relative">
              <SearchBar
                value={searchTerm}
                placeholder="Tìm kiếm..."
                onSearch={handleSearch}
              />
            </div>
          </div>

          {/* Main Layout Grid: 2 - 6 - 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: History (2/12) */}
            <div className="lg:col-span-2 hidden lg:block sticky top-24">
              <SearchHistory onSelectWord={handleSearch} />
            </div>

            {/* Center: Details (6/12) */}
            <div className="lg:col-span-6 min-h-[600px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-neutral-100">
                  <Loader2
                    className="animate-spin text-purple-600 mb-2"
                    size={32}
                  />
                  <p className="text-neutral-500 text-sm">
                    Đang tra cứu dữ liệu...
                  </p>
                </div>
              ) : error ? (
                <div className="bg-white p-12 rounded-3xl border border-neutral-100 text-center">
                  <p className="text-neutral-500">{error}</p>
                </div>
              ) : dbEntry ? (
                <DictDetailWord data={dbEntry} />
              ) : rawEntry ? (
                <RawDetailWord data={rawEntry} onRequestAI={handleRequestAI} />
              ) : (
                <div className="bg-white p-12 rounded-3xl border border-neutral-100 text-center">
                  <p className="text-neutral-400">
                    Hãy nhập từ vựng để bắt đầu tra cứu.
                  </p>
                </div>
              )}
            </div>

            {/* Right: AI & Trends (4/12) */}
            <div className="lg:col-span-4 hidden lg:block">
              <RightSidebar />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dictionary;
