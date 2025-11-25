import { Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { getRelatedWords } from "../../../api/clients/dictionaryApi";

const RelatedWords = ({ word, onSelectWord }) => {
  const [relatedWords, setRelatedWords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word) {
      setRelatedWords([]);
      return;
    }

    let isCancelled = false; // flag hủy request cũ
    setLoading(true);
    setRelatedWords([]);

    const fetchRelatedWords = async () => {
      try {
        const data = await getRelatedWords(word);
        if (!isCancelled) {
          setRelatedWords(data);
        }
      } catch (err) {
        if (!isCancelled) console.error("Fetch related words error:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchRelatedWords();

    return () => {
      // Khi word thay đổi hoặc unmount component
      isCancelled = true;
    };
  }, [word]);

  return (
    <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-neutral-700 font-bold pb-2 border-b border-neutral-100">
        <Hash size={18} />
        <h3>Từ liên quan</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {loading ? (
          // Skeleton đơn giản
          Array(5)
            .fill(0)
            .map((_, idx) => (
              <span
                key={idx}
                className="w-16 h-5 bg-neutral-200 rounded animate-pulse"
              />
            ))
        ) : relatedWords.length === 0 ? (
          <p className="text-xs text-neutral-400 italic">
            Không có từ liên quan
          </p>
        ) : (
          relatedWords.map((relatedWord, idx) => (
            <span
              key={idx}
              onClick={() => onSelectWord(relatedWord)}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-100"
            >
              {relatedWord}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default RelatedWords;
