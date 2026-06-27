import { useState, useEffect } from "react";
import { SearchX, Sparkles, Loader2 } from "lucide-react";
import { getAiSuggestion } from "@/api/clients/dictionaryApi";

const NotFoundState = ({ word, onSuggestionClick }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    let isMounted = true;

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
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-white dark:bg-neutral-900/60 rounded-lg border border-neutral-100 dark:border-neutral-800 shadow-sm">
      <div className="w-12 h-12 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 rounded-md flex items-center justify-center mb-4">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
        Không tìm thấy từ "{word}"
      </h3>
      <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-md text-sm">
        Có vẻ như từ này không tồn tại trong từ điển, hoặc đã bị gõ sai chính
        tả.
      </p>

      {/* AI Suggestions Section */}
      <div className="w-full max-w-lg bg-neutral-50 dark:bg-neutral-900/30 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-center gap-2 mb-4 text-neutral-700 dark:text-neutral-300">
          <Sparkles className="w-5 h-5 text-brand-500" />
          <span className="font-semibold text-sm">AI Gợi ý từ tương tự</span>
        </div>

        {loadingAi ? (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-400 dark:text-neutral-500" />
          </div>
        ) : suggestions.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(sug)}
                className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 dark:text-neutral-500 italic">
            AI không tìm thấy gợi ý nào phù hợp.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotFoundState;
