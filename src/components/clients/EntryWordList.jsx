import { useState, useEffect } from "react";
import { Volume2, Languages, ChevronDown, Loader2 } from "lucide-react";
import { logError } from "../../utils/logError";

const EntryWordList = ({ id, fetchApi, pageSize = 5 }) => {
  const [words, setWords] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  useEffect(() => {
    if (id) fetchWords(1);
  }, [id]);

  const fetchWords = async (pageNum) => {
    try {
      setLoading(true);
      setIsFirstLoad(pageNum === 1);

      const res = await fetchApi(id, pageNum, pageSize);
      if (res) {
        setWords((prev) =>
          pageNum === 1 ? res.content : [...prev, ...res.content]
        );
        setHasMore(!res.last);
        setPage(pageNum);
      }
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
      setIsFirstLoad(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) fetchWords(page + 1);
  };

  const getPosStyle = (pos) => {
    const p = pos?.toLowerCase() || "";
    if (p.includes("noun") || p.includes("n."))
      return "bg-blue-50 text-blue-700 border-blue-100";
    if (p.includes("verb") || p.includes("v."))
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (p.includes("adj"))
      return "bg-purple-50 text-purple-700 border-purple-100";
    if (p.includes("adv")) return "bg-amber-50 text-amber-700 border-amber-100";
    if (p.includes("pro")) return "bg-pink-50 text-pink-700 border-pink-100";
    if (p.includes("det"))
      return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100";
    if (p.includes("prep")) return "bg-cyan-50 text-cyan-700 border-cyan-100";
    if (p.includes("conj")) return "bg-lime-50 text-lime-700 border-lime-100";
    if (p.includes("interj")) return "bg-rose-50 text-rose-700 border-rose-100";
    if (p.includes("phrase")) return "bg-gray-50 text-gray-700 border-gray-100";
    return "bg-indigo-50 text-indigo-700 border-indigo-100";
  };

  if (isFirstLoad && loading) {
    return (
      <div className="mt-8 pt-6 border-t border-dashed border-indigo-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-6 w-40 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!loading && words.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-dashed border-indigo-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 text-indigo-900">
        <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
          <Languages size={18} />
        </div>
        <h2 className="text-lg font-bold">Từ vựng quan trọng</h2>
      </div>

      <div className="flex flex-col gap-1">
        {words.map((entry) => (
          <div
            key={entry.id}
            className="group flex flex-col sm:flex-row gap-2 sm:gap-6 py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-100"
          >
            {/* LEFT */}
            <div className="sm:w-40 flex-shrink-0 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-indigo-700 group-hover:text-indigo-600 transition-colors">
                  {entry.headword}
                </span>

                {entry.audio_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      new Audio(entry.audio_url).play();
                    }}
                    className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>

              {entry.ipa && (
                <span className="text-xs text-slate-500 font-mono block mt-0.5">
                  {entry.ipa}
                </span>
              )}
            </div>

            {/* RIGHT */}
            <div className="flex-1 space-y-3">
              {entry.senses?.map((sense) => (
                <div key={sense.id} className="text-sm">
                  <div className="leading-snug text-slate-800">
                    <span
                      className={`
                        inline-block px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wide border
                        mr-2 align-middle ${getPosStyle(sense.pos)}
                      `}
                    >
                      {sense.pos}
                    </span>

                    <span className="font-bold text-slate-900 mr-1.5">
                      {sense.meaning}
                    </span>
                    <span className="text-slate-500">— {sense.definition}</span>
                  </div>

                  {sense.example && (
                    <div className="mt-1.5 ml-1 pl-3 border-l-2 border-indigo-200 text-xs text-slate-600 italic">
                      "{sense.example}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 pt-2 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 hover:bg-indigo-100 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span>Xem thêm từ vựng</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default EntryWordList;
