import { useState, useEffect, useCallback } from 'react';
import {
    searchByFreeDictionaryApi,
    searchByTodaiiDictionary
} from '@/api/servers/dictionaryApi';
import { logError } from "@/utils/LogError";

export const useDictionarySearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [apiSource, setApiSource] = useState("free"); // 'free' hoặc 'todaii'
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);

    // Load history từ LocalStorage khi mount
    useEffect(() => {
        const saved = localStorage.getItem("dictionarySearchHistory");
        if (saved) {
            try {
                setSearchHistory(JSON.parse(saved));
            } catch (err) {
                console.error("Error parsing history:", err);
            }
        }
    }, []);

    const saveToHistory = useCallback((word) => {
        setSearchHistory((prev) => {
            const filtered = prev.filter((item) => item !== word);
            const updated = [word, ...filtered].slice(0, 20);
            localStorage.setItem("dictionarySearchHistory", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setSearchHistory([]);
        localStorage.removeItem("dictionarySearchHistory");
    }, []);

    const removeHistoryItem = useCallback((wordToRemove) => {
        setSearchHistory((prev) => {
            const updated = prev.filter((item) => item !== wordToRemove);
            localStorage.setItem("dictionarySearchHistory", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const executeSearch = useCallback(async (word, source) => {
        if (!word.trim()) {
            setData(null);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let result;
            if (source === "free") {
                result = await searchByFreeDictionaryApi(word);
            } else {
                result = await searchByTodaiiDictionary(word, 1, 20);
            }

            setData(result);
            // Chỉ lưu history khi có kết quả hợp lệ (không lỗi 404)
            if (result && (result.length > 0 || result.found)) {
                saveToHistory(word);
            }
        } catch (err) {
            logError(err);
            setData(null);
            // Phân biệt lỗi 404 (Not found) để UI hiển thị Fallback
            if (err.response && err.response.status === 404) {
                setError("NOT_FOUND");
            } else {
                setError("SERVER_ERROR");
            }
        } finally {
            setIsLoading(false);
        }
    }, [saveToHistory]);

    // Xử lý Debounce Pattern chuẩn của React
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                executeSearch(searchTerm, apiSource);
            }
        }, 1000);

        // Cleanup function: hủy timeout cũ nếu user tiếp tục gõ
        return () => clearTimeout(timer);
    }, [searchTerm, apiSource, executeSearch]);

    return {
        searchTerm,
        setSearchTerm,
        apiSource,
        setApiSource,
        data,
        isLoading,
        error,
        searchHistory,
        clearHistory,
        removeHistoryItem,
        executeSearch // Expose ra ngoài để user bấm vào history có thể search ngay lập tức
    };
};