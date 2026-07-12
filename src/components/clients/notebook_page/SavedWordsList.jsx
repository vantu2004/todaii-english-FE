import {
  Trash2,
  Loader2,
  BookDashed,
  Download,
  RefreshCw,
  Check,
} from "lucide-react";

// words shape (sau khi map qua mapDictionaryWord):
// { id, word, ipa, pos, meaning, example, audio_url, hasData }
const SavedWordsList = ({
  words,
  loading,
  onSelect,
  onRemove,
  onFetchWord,
  onFetchAll,
  fetchingIds,
  errorIds,
  activeWord,
  learnedWordIds = [],
  onToggleLearn,
  togglingWordIds = {},
}) => {
  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-neutral-400 dark:text-neutral-500" />
      </div>
    );

  if (!words.length)
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-400 opacity-60 select-none dark:text-neutral-500">
        <BookDashed size={40} className="mb-3" />
        <p className="text-sm">Empty list</p>
      </div>
    );

  const missingCount = words.filter((w) => !w.hasData).length;
  const isFetchingAny = Object.values(fetchingIds || {}).some(Boolean);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Banner fetch all */}
      {missingCount > 0 && (
        <div className="mx-3 mt-3 flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 shrink-0">
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-snug">
            <span className="font-bold">{missingCount} từ</span> chưa có dữ liệu
          </span>
          <button
            onClick={onFetchAll}
            disabled={isFetchingAny}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-bold transition-colors shrink-0"
          >
            {isFetchingAny ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <RefreshCw size={11} />
            )}
            Tải tất cả
          </button>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {words.map((word) => {
          const isActive = activeWord === word.word;
          const isFetching = !!fetchingIds?.[word.id];
          const hasError = !!errorIds?.[word.id];

          return (
            <div
              key={word.id}
              onClick={() => onSelect(word)}
              className={`
                group p-3.5 rounded-lg border cursor-pointer transition-colors relative
                ${
                  isActive
                    ? "bg-white border-neutral-900 dark:bg-neutral-800 dark:border-white"
                    : "bg-white border-neutral-200 hover:border-neutral-300 dark:bg-neutral-800/50 dark:border-neutral-700 dark:hover:border-neutral-600"
                }
              `}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  {/* Word + IPA */}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isActive
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {word.word}
                    </h3>
                    {word.ipa && (
                      <span className="text-[10px] text-neutral-500 font-mono bg-neutral-100 px-1.5 py-0.5 rounded-sm dark:text-neutral-400 dark:bg-neutral-700">
                        {word.ipa}
                      </span>
                    )}
                  </div>

                  {/* Meaning hoặc nút fetch */}
                  {word.hasData ? (
                    word.meaning && (
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed dark:text-neutral-400">
                        {word.meaning}
                      </p>
                    )
                  ) : (
                    <div
                      className="mt-1.5 flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isFetching ? (
                        <span className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                          <Loader2 size={11} className="animate-spin" />
                          Đang tải...
                        </span>
                      ) : (
                        <button
                          onClick={() => onFetchWord(word)}
                          className="flex items-center gap-1 text-[11px] font-bold border border-dashed border-neutral-300 dark:border-neutral-600 text-neutral-400 dark:text-neutral-500 hover:border-neutral-500 dark:hover:border-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 px-2 py-0.5 rounded-md transition-all"
                        >
                          <Download size={10} /> Tải dữ liệu
                        </button>
                      )}
                      {hasError && (
                        <span className="text-[11px] text-red-400 dark:text-red-500">
                          Không tìm thấy
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {onToggleLearn && (
                    <button
                      onClick={() => onToggleLearn(word.id)}
                      disabled={togglingWordIds[word.id]}
                      className={`p-1.5 rounded-md border transition-all ${
                        togglingWordIds[word.id]
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      } ${
                        learnedWordIds.includes(word.id)
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-100"
                          : "bg-transparent border-neutral-200 dark:border-neutral-700 text-neutral-300 dark:text-neutral-500 hover:border-emerald-500 hover:text-emerald-500"
                      }`}
                      title={
                        learnedWordIds.includes(word.id) ? "Đã học" : "Chưa học"
                      }
                    >
                      <Check size={12} />
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={(e) => onRemove(word.id, e)}
                    className="p-1.5 rounded-md text-neutral-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all dark:text-neutral-600 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                    title="Delete word"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedWordsList;
