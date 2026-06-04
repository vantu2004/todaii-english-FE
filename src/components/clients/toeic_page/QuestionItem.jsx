import React, { forwardRef } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

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
    },
    ref,
  ) => {
    const options = optionCount === 3 ? ["A", "B", "C"] : ["A", "B", "C", "D"];

    return (
      <div
        ref={ref}
        id={`question-${question.id}`}
        className="mb-6 p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm transition-colors"
      >
        {/* Question header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-8 h-8 shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center font-bold text-sm text-neutral-700 dark:text-neutral-300">
              {questionNumber}
            </div>
            <div className="flex-1 min-w-0">
              {question.question && (
                <p
                  className="text-neutral-900 dark:text-white font-medium text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />
              )}
            </div>
          </div>

          {/* Bookmark button */}
          <button
            type="button"
            onClick={() => onToggleMark(question.id)}
            className={`shrink-0 p-1.5 rounded-lg transition-all ${
              isMarked
                ? "text-amber-500 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20"
                : "text-neutral-300 dark:text-neutral-600 hover:text-amber-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
            title={isMarked ? "Bỏ đánh dấu" : "Đánh dấu để xem lại"}
          >
            {isMarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>

        {/* Question media */}
        {question.image_url && (
          <img
            src={question.image_url}
            alt={`Câu ${questionNumber}`}
            className="max-w-md w-full rounded-xl mb-4 ml-11"
          />
        )}

        {question.audio_url && (
          <audio
            controls
            className="w-full mb-4 max-w-md ml-11"
            src={question.audio_url}
          />
        )}

        {/* Options */}
        <div className="space-y-2.5 ml-11">
          {options.map((opt) => {
            const optionText = question[`option_${opt.toLowerCase()}`];
            const isSelected = selectedAnswer === opt;

            return (
              <label
                key={opt}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value={opt}
                  checked={isSelected}
                  onChange={() => onSelectAnswer(question.id, opt)}
                  className="w-4 h-4 text-brand-500 border-neutral-300 dark:border-neutral-600 focus:ring-brand-500"
                />
                <span
                  className={`font-semibold w-6 ${
                    isSelected
                      ? "text-brand-600 dark:text-brand-400"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {opt}.
                </span>
                {optionText && (
                  <span
                    className={`${
                      isSelected
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {optionText}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    );
  },
);

QuestionItem.displayName = "QuestionItem";

export default QuestionItem;
