import React from "react";

const QuickAnswerList = ({ flatQuestions, answersMap, onQuestionClick }) => {
  // Group questions by part
  const questionsByPart = {};
  flatQuestions.forEach((q) => {
    if (!questionsByPart[q.partNumber]) {
      questionsByPart[q.partNumber] = [];
    }
    questionsByPart[q.partNumber].push(q);
  });

  const partNumbers = Object.keys(questionsByPart)
    .map(Number)
    .sort((a, b) => a - b);

  if (flatQuestions.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2.5">
        <h2 className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
          Đáp án nhanh
        </h2>
      </div>

      <div className="space-y-2">
        {partNumbers.map((partNum) => {
          const questions = questionsByPart[partNum] || [];

          return (
            <div
              key={partNum}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5 space-y-2"
            >
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-1">
                Part {partNum}
              </h3>

              <div className="flex flex-wrap gap-1">
                {questions.map((q) => {
                  const ans = answersMap[q.id];
                  const userChoice = ans?.user_choice || null;
                  const status = ans ? ans.status : 2; // 1: correct, 0: incorrect, 2: skipped
                  const correctAns = q.correctAnswer || "A";

                  let cardStyle = "";
                  let icon = "";
                  let displayUserChoice = null;

                  if (status === 1) {
                    // Correct
                    cardStyle =
                      "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-800 text-emerald-800 dark:text-emerald-350";
                    icon = "✓";
                  } else if (status === 0) {
                    // Incorrect
                    cardStyle =
                      "bg-rose-50 dark:bg-rose-955/20 border-rose-250 dark:border-rose-800/40 text-rose-850 dark:text-rose-350";
                    icon = "×";
                    displayUserChoice = userChoice;
                  } else {
                    // Skipped
                    cardStyle =
                      "bg-neutral-50 dark:bg-neutral-800/30 border-neutral-250 dark:border-neutral-700 text-neutral-600 dark:text-neutral-450";
                    icon = "−";
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onQuestionClick && onQuestionClick(q.id)}
                      className={`inline-flex items-center justify-center gap-0.5 px-2 py-0.5 rounded border border-gray-300 text-[10px] font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all ${cardStyle}`}
                      title={`Câu ${q.questionNumber}: Đáp án đúng ${correctAns}. Click để xem chi tiết.`}
                    >
                      <span className="opacity-80 text-[8.5px]">
                        {q.questionNumber}:
                      </span>
                      <span>{correctAns}</span>

                      {displayUserChoice && (
                        <span className="line-through text-rose-600/70 dark:text-rose-300/70 text-[8.5px] font-normal mx-0.5">
                          ({displayUserChoice})
                        </span>
                      )}

                      <span className="text-[8.5px] font-extrabold">
                        {icon}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAnswerList;
