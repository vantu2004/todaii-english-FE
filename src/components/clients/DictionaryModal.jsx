import React, { useState, useEffect } from "react";
import { X, AlertTriangle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  searchByFreeDictionaryApi,
  searchByTodaiiDictionary,
} from "@/api/clients/dictionaryApi";
import TodaiiDictResult from "@/components/clients/dictionary_page/TodaiiDictResult";
import FreeDictResult from "@/components/clients/dictionary_page/FreeDictResult";
import LoadingSkeleton from "@/components/clients/dictionary_page/LoadingSkeleton";
import NotFoundState from "@/components/clients/dictionary_page/NotFoundState";

const DictionaryModal = ({ word, isOpen, onClose }) => {
  const [localWord, setLocalWord] = useState(word || "");
  const [apiSource, setApiSource] = useState("todaii"); // 'todaii' hoặc 'free'
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync localWord khi modal mở hoặc prop word thay đổi
  useEffect(() => {
    if (isOpen && word) {
      setLocalWord(word);
    }
  }, [word, isOpen]);

  // Fetch dữ liệu từ điển khi localWord hoặc apiSource thay đổi
  useEffect(() => {
    if (!localWord || !isOpen) return;

    const fetchWordData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        let result;
        if (apiSource === "free") {
          result = await searchByFreeDictionaryApi(localWord);
        } else {
          result = await searchByTodaiiDictionary(localWord, 1, 20);
        }
        setData(result);
      } catch (err) {
        console.error("Fetch dictionary error in modal:", err);
        if (err.response && err.response.status === 404) {
          setError("NOT_FOUND");
        } else {
          setError("SERVER_ERROR");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordData();
  }, [localWord, apiSource, isOpen]);

  const handleWordClick = (newWord) => {
    if (newWord) {
      setLocalWord(newWord);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const hasResults = !isLoading && !error && data;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-neutral-900 
              border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 m-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-500" />
                <span>
                  Tra cứu từ:{" "}
                  <span className="font-serif italic text-brand-500">
                    {localWord}
                  </span>
                </span>
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-450 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-inner mb-6 self-start">
              <button
                onClick={() => setApiSource("todaii")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  apiSource === "todaii"
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                    : "text-neutral-505 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Todaii API
              </button>
              <button
                onClick={() => setApiSource("free")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  apiSource === "free"
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                    : "text-neutral-505 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Free API
              </button>
            </div>

            {/* Body (Scrollable container) */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1 -mr-2">
              {isLoading && <LoadingSkeleton />}

              {error === "NOT_FOUND" && (
                <NotFoundState
                  word={localWord}
                  onSuggestionClick={handleWordClick}
                />
              )}

              {error === "SERVER_ERROR" && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-3">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">
                    Không thể kết nối
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
                    Có lỗi xảy ra khi tải dữ liệu từ điển. Vui lòng kiểm tra lại
                    kết nối mạng.
                  </p>
                </div>
              )}

              {hasResults && apiSource === "todaii" && (
                <TodaiiDictResult data={data} onWordClick={handleWordClick} />
              )}

              {hasResults && apiSource === "free" && (
                <FreeDictResult data={data} onWordClick={handleWordClick} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DictionaryModal;
