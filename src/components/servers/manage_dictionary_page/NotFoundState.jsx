import { useState, useEffect } from "react";
import { SearchX, Sparkles, Loader } from "lucide-react";
import { getAiSuggestion } from "@/api/servers/dictionaryApi";

const NotFoundState = ({ word, onSuggestionClick }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    let isMounted = true; // Tránh memory leak khi unmount

    const fetchSuggestions = async () => {
      if (!word) return;
      setLoadingAi(true);
      try {
        const data = await getAiSuggestion(word);
        if (isMounted) setSuggestions(data || []);
      } catch (error) {
        console.error("Failed to fetch AI suggestions", error);
      } finally {
        if (isMounted) setLoadingAi(false);
      }
    };

    fetchSuggestions();

    return () => {
      isMounted = false;
    };
  }, [word]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-full flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Không tìm thấy từ "{word}"
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        Có vẻ như từ này không tồn tại trong từ điển hiện tại, hoặc đã bị gõ sai
        chính tả.
      </p>

      {/* AI Suggestions Section */}
      <div className="w-full max-w-lg bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-700 dark:text-gray-300">
          <Sparkles className="w-5 h-5 text-gray-500" />
          <span className="font-medium">AI Gợi ý từ tương tự</span>
        </div>

        {loadingAi ? (
          <div className="flex justify-center py-2">
            <Loader className="w-5 h-5 animate-spin text-gray-500" />
          </div>
        ) : suggestions.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(sug)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            AI không tìm thấy gợi ý nào phù hợp.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotFoundState;
