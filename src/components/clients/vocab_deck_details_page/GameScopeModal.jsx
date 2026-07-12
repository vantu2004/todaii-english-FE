import React, { useState, useEffect } from "react";
import { X, Play, BookOpen, BookMarked, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GameScopeModal = ({
  isOpen,
  onClose,
  words = [],
  learnedWordIds = [],
  gameMode = "",
  onStart,
}) => {
  const [selectedScope, setSelectedScope] = useState("all");

  const totalCount = words.length;
  const learnedCount = words.filter((w) => learnedWordIds.includes(w.id)).length;
  const unlearnedCount = totalCount - learnedCount;

  const minRequired = gameMode === "quiz" || gameMode === "speed" ? 4 : 1;

  // Reset selected scope when modal opens
  useEffect(() => {
    if (isOpen) {
      if (totalCount >= minRequired) {
        setSelectedScope("all");
      } else if (unlearnedCount >= minRequired) {
        setSelectedScope("unlearned");
      } else if (learnedCount >= minRequired) {
        setSelectedScope("learned");
      } else {
        setSelectedScope("all");
      }
    }
  }, [isOpen, totalCount, unlearnedCount, learnedCount, minRequired]);

  if (!isOpen) return null;

  const getFilteredWords = (scope) => {
    if (scope === "unlearned") {
      return words.filter((w) => !learnedWordIds.includes(w.id));
    }
    if (scope === "learned") {
      return words.filter((w) => learnedWordIds.includes(w.id));
    }
    return words;
  };

  const handleStartGame = () => {
    const filtered = getFilteredWords(selectedScope);
    onStart(filtered);
  };

  const getGameModeName = () => {
    switch (gameMode) {
      case "flashcard":
        return "Flashcard";
      case "quiz":
        return "Trắc nghiệm";
      case "speed":
        return "Tốc độ";
      case "typing":
        return "Gõ nhanh";
      default:
        return "Trò chơi";
    }
  };

  const options = [
    {
      id: "all",
      label: "Luyện tập tất cả",
      desc: "Học toàn bộ từ vựng đã có nghĩa trong bộ từ vựng này.",
      count: totalCount,
      icon: BookOpen,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
    },
    {
      id: "unlearned",
      label: "Học từ chưa học",
      desc: "Chỉ tập trung vào các từ vựng bạn chưa đánh dấu 'Đã học'.",
      count: unlearnedCount,
      icon: BookMarked,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
    },
    {
      id: "learned",
      label: "Ôn từ đã học",
      desc: "Ôn tập củng cố các từ vựng bạn đã đánh dấu 'Đã học'.",
      count: learnedCount,
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl z-10 m-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Chọn phạm vi ôn tập
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  Chế độ chơi: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{getGameModeName()}</span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                title="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scope Choices */}
            <div className="space-y-3 mb-6">
              {options.map((opt) => {
                const Icon = opt.icon;
                const isDisabled = opt.count < minRequired;
                const isSelected = selectedScope === opt.id;

                return (
                  <button
                    key={opt.id}
                    disabled={isDisabled}
                    onClick={() => setSelectedScope(opt.id)}
                    className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-all relative ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20"
                        : isSelected
                        ? "border-neutral-900 dark:border-white bg-neutral-50/40 dark:bg-neutral-800/20 shadow-sm"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 ${opt.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {opt.label}
                        </span>
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                          {opt.count} từ
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 leading-normal pr-4">
                        {opt.desc}
                      </p>

                      {isDisabled && (
                        <p className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-1.5">
                          Yêu cầu tối thiểu {minRequired} từ để chơi.
                        </p>
                      )}
                    </div>

                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleStartGame}
                disabled={getFilteredWords(selectedScope).length < minRequired}
                className="flex-1 py-3 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs rounded-2xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Bắt đầu</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GameScopeModal;
