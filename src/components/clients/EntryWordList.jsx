import { useState, useEffect } from "react";
import { Volume2, Languages, ChevronDown, Loader2 } from "lucide-react";
import { logError } from "@/utils/logError";

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
          pageNum === 1 ? res.content : [...prev, ...res.content],
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
      return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800";
    if (p.includes("verb") || p.includes("v."))
      return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800";
    if (p.includes("adj"))
      return "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800";
    if (p.includes("adv"))
      return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800";
    if (p.includes("pro"))
      return "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border-pink-100 dark:border-pink-800";
    if (p.includes("det"))
      return "bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-100 dark:border-fuchsia-800";
    if (p.includes("prep"))
      return "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-100 dark:border-cyan-800";
    if (p.includes("conj"))
      return "bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 border-lime-100 dark:border-lime-800";
    if (p.includes("interj"))
      return "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800";
    if (p.includes("phrase"))
      return "bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border-gray-100 dark:border-neutral-700";
    return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800";
  };

  if (isFirstLoad && loading) {
    return (
      <div className="mt-8 pt-6 border-t border-dashed border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-gray-100 dark:bg-neutral-800 rounded-lg animate-pulse" />
          <div className="h-6 w-40 bg-gray-100 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-50 dark:bg-neutral-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!loading && words.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-dashed border-indigo-100 dark:border-indigo-900/50">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 text-indigo-900 dark:text-indigo-200">
        <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Languages size={18} />
        </div>
        <h2 className="text-lg font-bold">Từ vựng quan trọng</h2>
      </div>

      <div className="flex flex-col gap-1">
        {words.map((entry) => (
          <div
            key={entry.id}
            className="group flex flex-col sm:flex-row gap-2 sm:gap-6 py-3 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-800/50 transition-colors duration-200 border border-transparent hover:border-slate-100 dark:hover:border-neutral-700"
          >
            {/* LEFT */}
            <div className="sm:w-40 flex-shrink-0 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">
                  {entry.headword}
                </span>

                {entry.audio_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      new Audio(entry.audio_url).play();
                    }}
                    className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-all"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>

              {entry.ipa && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block mt-0.5">
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

                    <span className="font-bold text-slate-900 dark:text-slate-100 mr-1.5">
                      {sense.meaning}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      — {sense.definition}
                    </span>
                  </div>

                  {sense.example && (
                    <div className="mt-1.5 ml-1 pl-3 border-l-2 border-indigo-200 dark:border-indigo-800 text-xs text-slate-600 dark:text-slate-400 italic">
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
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-70"
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
