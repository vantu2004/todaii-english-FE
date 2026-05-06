import React, { useState, useMemo } from "react";
import { Check, X, Trophy, ArrowRight, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QuizGame = ({ words, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Logic tạo câu hỏi: Chọn 1 từ đúng, 3 từ sai ngẫu nhiên
  const questions = useMemo(() => {
    if (!words || words.length < 4) return []; // Cần tối thiểu 4 từ

    // Copy và shuffle mảng từ vựng gốc để thứ tự câu hỏi ngẫu nhiên
    const shuffledWords = [...words].sort(() => 0.5 - Math.random());

    return shuffledWords.map((targetWord) => {
      // Lấy 3 từ khác làm đáp án sai
      const distractors = words
        .filter((w) => w.id !== targetWord.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // Trộn target với distractors
      const options = [targetWord, ...distractors].sort(
        () => 0.5 - Math.random()
      );

      return {
        target: targetWord,
        options: options,
      };
    });
  }, [words]);

  const currentQuestion = questions[currentIndex];

  // Handlers
  const handleAnswer = (option) => {
    if (selectedAnswer) return; // Chặn spam click
    setSelectedAnswer(option);
    setShowResult(true);

    if (option.id === currentQuestion.target.id) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  // --- ERROR STATE: Not enough words ---
  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl text-center max-w-sm border border-transparent dark:border-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Cần ít nhất 4 từ vựng để bắt đầu trắc nghiệm.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  // --- FINISHED SCREEN ---
  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-surface-primary dark:bg-neutral-950 animate-in fade-in">
        <div className="bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-neutral-100 dark:border-neutral-800 mx-4">
          <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-100 dark:border-yellow-800">
            <Trophy size={48} className="text-yellow-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Hoàn thành!
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 font-medium">
            Bạn đã trả lời đúng
          </p>

          <div className="text-6xl font-bold text-neutral-900 dark:text-white mb-8 tracking-tight">
            {score}{" "}
            <span className="text-3xl text-neutral-300 dark:text-neutral-600">
              / {questions.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-xl hover:-translate-y-1"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // --- PLAYING SCREEN ---
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-surface-primary dark:bg-neutral-950 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
        >
          <CloseIcon size={24} />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-6 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 dark:bg-white transition-all duration-500 ease-out"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="font-bold text-neutral-900 dark:text-white text-sm tabular-nums">
          {score} điểm
        </div>
      </div>

      {/* Question Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-4 block">
            Chọn nghĩa đúng
          </span>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
            {currentQuestion.target.word}
          </h2>
          {currentQuestion.target.ipa && (
            <p className="text-lg text-neutral-400 dark:text-neutral-500 font-mono">
              {currentQuestion.target.ipa}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {currentQuestion.options.map((option) => {
            let btnClass =
              "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 hover:shadow-md";
            let icon = null;

            if (showResult) {
              if (option.id === currentQuestion.target.id) {
                // Correct Answer
                btnClass =
                  "bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-400 ring-1 ring-green-500 shadow-none";
                icon = <Check size={20} />;
              } else if (option.id === selectedAnswer?.id) {
                // Wrong Answer
                btnClass =
                  "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-400 opacity-100 shadow-none";
                icon = <X size={20} />;
              } else {
                // Other options
                btnClass =
                  "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800 text-neutral-300 dark:text-neutral-600 opacity-60";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`
                  relative p-6 rounded-2xl border-2 text-left transition-all duration-200
                  flex items-center justify-between text-base font-medium leading-snug
                  active:scale-[0.98]
                  ${btnClass}
                `}
              >
                {option.meaning}
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Next Button */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 flex justify-center px-4 pointer-events-none"
          >
            <button
              onClick={handleNext}
              className="pointer-events-auto flex items-center gap-3 px-10 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-lg font-bold rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_24px_rgba(255,255,255,0.1)] hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:-translate-y-1 transition-all"
            >
              {currentIndex === questions.length - 1
                ? "Xem kết quả"
                : "Câu tiếp theo"}
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizGame;
