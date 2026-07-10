import { useState } from "react";
import { CheckCircle2, XCircle, Info, Sparkles, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PracticeQuestions = ({ questions = [] }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> option ('A', 'B', 'C', 'D')
  const [submitted, setSubmitted] = useState({}); // questionId -> boolean

  if (questions.length === 0) {
    return null;
  }

  const handleSelectOption = (questionId, option) => {
    if (submitted[questionId]) return; // Cannot select after checking
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleCheckAnswer = (questionId) => {
    if (!selectedAnswers[questionId]) return;
    setSubmitted((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleResetQuestion = (questionId) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setSubmitted((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  // Calculate score
  const answeredCount = Object.keys(submitted).length;
  const correctCount = Object.keys(submitted).reduce((count, qid) => {
    const question = questions.find((q) => q.id === Number(qid));
    if (question && selectedAnswers[qid] === question.correct_option) {
      return count + 1;
    }
    return count;
  }, 0);

  return (
    <div className="bg-white dark:bg-neutral-900/50 rounded-lg p-4 sm:p-6 border border-neutral-200 dark:border-neutral-900/80 shadow-sm mt-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400 rounded-md">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm sm:text-base tracking-tight">
              Bài tập đọc hiểu
            </h3>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
              Trả lời câu hỏi trắc nghiệm để củng cố nội dung bài học
            </p>
          </div>
        </div>

        {/* Score Counter */}
        {answeredCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-1.5 self-start sm:self-center"
          >
            <span>
              Đúng {correctCount}/{answeredCount} câu
            </span>
            {correctCount === answeredCount &&
              answeredCount === questions.length && (
                <span className="text-[10px]">✨ Hoàn hảo!</span>
              )}
          </motion.div>
        )}
      </div>

      {/* Questions Stack */}
      <div className="space-y-8">
        {questions.map((q, idx) => {
          const isSubmitted = submitted[q.id];
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correct_option;

          const options = [
            { key: "A", text: q.option_a },
            { key: "B", text: q.option_b },
            { key: "C", text: q.option_c },
            { key: "D", text: q.option_d },
          ];

          return (
            <div
              key={q.id}
              className="group border-b last:border-0 border-neutral-100 dark:border-neutral-800 pb-8 last:pb-0"
            >
              {/* Question Text */}
              <div className="flex gap-2.5 items-start mb-4">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-mono font-bold mt-0.5">
                  {idx + 1}
                </span>
                <h4 className="font-medium text-neutral-900 dark:text-white text-sm sm:text-base leading-relaxed select-text">
                  {q.question_text}
                </h4>
              </div>

              {/* Options list */}
              <div className="grid grid-cols-1 gap-2.5 max-w-2xl ml-7">
                {options.map((opt) => {
                  const isOptSelected = selected === opt.key;
                  const isOptCorrect = opt.key === q.correct_option;

                  let optStyle =
                    "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50";
                  let checkMark = null;

                  if (isSubmitted) {
                    if (isOptCorrect) {
                      // Correct option is always highlighted green
                      optStyle =
                        "border-green-500 dark:border-green-600 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-medium";
                      checkMark = (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      );
                    } else if (isOptSelected) {
                      // User selected wrong option
                      optStyle =
                        "border-red-500 dark:border-red-600 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300 font-medium";
                      checkMark = (
                        <X className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      );
                    } else {
                      // Other options disabled
                      optStyle =
                        "border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-900/50 text-neutral-400 dark:text-neutral-500 opacity-60";
                    }
                  } else if (isOptSelected) {
                    // Selected but not yet submitted
                    optStyle =
                      "border-brand-500 ring-2 ring-brand-500/10 bg-brand-50/10 dark:bg-brand-950/10 text-neutral-900 dark:text-white font-medium";
                  }

                  return (
                    <button
                      key={opt.key}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      className={`w-full flex items-center justify-between gap-3 text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-150 ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors flex-shrink-0
                          ${
                            isSubmitted && isOptCorrect
                              ? "bg-green-500 text-white border-green-500"
                              : isSubmitted && isOptSelected
                                ? "bg-red-500 text-white border-red-500"
                                : isOptSelected
                                  ? "bg-brand-500 text-white border-brand-500"
                                  : "bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
                          }
                        `}
                        >
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {checkMark}
                    </button>
                  );
                })}
              </div>

              {/* Action buttons (Check Answer / Try again) */}
              <div className="ml-7 mt-4 flex items-center gap-3">
                {!isSubmitted ? (
                  <button
                    disabled={!selected}
                    onClick={() => handleCheckAnswer(q.id)}
                    className="px-4 py-1.5 text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                  >
                    Kiểm tra đáp án
                  </button>
                ) : (
                  <button
                    onClick={() => handleResetQuestion(q.id)}
                    className="px-4 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-150"
                  >
                    Làm lại
                  </button>
                )}
              </div>

              {/* Explanation section */}
              <AnimatePresence>
                {isSubmitted && q.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden ml-7 mt-4"
                  >
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 max-w-2xl">
                      <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                          Giải thích đáp án:
                        </span>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PracticeQuestions;
