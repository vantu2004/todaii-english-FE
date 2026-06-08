import React, { forwardRef } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

const getImages = (urlStr) => {
  if (!urlStr) return [];
  return urlStr
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};

const QuestionItem = forwardRef(
  (
    {
      question,
      questionNumber,
      selectedAnswer,
      isMarked,
      onSelectAnswer,
      onToggleMark,
      optionCount = 4,
      mode,
      partNumber,
    },
    ref,
  ) => {
    const options = optionCount === 3 ? ["A", "B", "C"] : ["A", "B", "C", "D"];
    const resolvedPartNumber = partNumber || question.part_number;
    const showAudio =
      question.audio_url &&
      mode !== "FULL_TEST" &&
      ![5, 6, 7].includes(resolvedPartNumber);
    const hasMedia = question.image_url || showAudio;

    return (
      <div
        ref={ref}
        id={`question-${question.id}`}
        className="mb-3 p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors"
      >
        <div
          className={
            hasMedia ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-2.5"
          }
        >
          {/* Media Column (Left) */}
          {hasMedia && (
            <div className="flex flex-col gap-2 justify-center min-w-0">
              {getImages(question.image_url).map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Câu ${questionNumber}`}
                  className="w-full rounded-lg object-contain border border-neutral-100 dark:border-neutral-850"
                />
              ))}
              {showAudio && (
                <audio controls className="w-full" src={question.audio_url} />
              )}
            </div>
          )}

          {/* Text/Options Column (Right) */}
          <div className="space-y-2.5 min-w-0">
            {/* Question header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1">
                <div className="w-6 h-6 shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center font-bold text-xs text-neutral-700 dark:text-neutral-300">
                  {questionNumber}
                </div>
                <div className="flex-1 min-w-0">
                  {question.question && (
                    <p
                      className="text-neutral-900 dark:text-white font-medium text-sm sm:text-base leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: question.question }}
                    />
                  )}
                </div>
              </div>

              {/* Bookmark button */}
              <button
                type="button"
                onClick={() => onToggleMark(question.id)}
                className={`shrink-0 p-1 rounded-md transition-all ${
                  isMarked
                    ? "text-amber-500 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100"
                    : "text-neutral-300 dark:text-neutral-600 hover:text-amber-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                title={isMarked ? "Bỏ đánh dấu" : "Đánh dấu để xem lại"}
              >
                {isMarked ? (
                  <BookmarkCheck size={14} />
                ) : (
                  <Bookmark size={14} />
                )}
              </button>
            </div>

            {/* Options */}
            <div className={`space-y-1.5 ${hasMedia ? "ml-0" : "ml-8.5"}`}>
              {options.map((opt) => {
                const optionText = question[`option_${opt.toLowerCase()}`];
                const isSelected = selectedAnswer === opt;

                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 py-1 px-2.5 rounded-md border cursor-pointer transition-all text-xs sm:text-sm ${
                      isSelected
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => onSelectAnswer(question.id, opt)}
                      className="w-3.5 h-3.5 text-brand-500 border-neutral-300 dark:border-neutral-600 focus:ring-brand-500"
                    />
                    <span
                      className={`font-semibold w-4 ${
                        isSelected
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {opt}.
                    </span>
                    {optionText && (
                      <span
                        className={
                          isSelected
                            ? "text-brand-700 dark:text-brand-300"
                            : "text-neutral-600 dark:text-neutral-400"
                        }
                      >
                        {optionText}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

QuestionItem.displayName = "QuestionItem";

export default QuestionItem;
