import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Trophy,
  ArrowRight,
  Lightbulb,
  Volume2,
  CheckCircle2,
  XCircle,
  Flame,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const normalize = (str) => str.trim().toLowerCase();

// Gợi ý: mở dần từng ký tự từ trái → "a _ _ _ _ _ _ _ _"
const buildHint = (word, hintLevel) =>
  word
    .split("")
    .map((c, i) => (i <= hintLevel ? c : c === " " ? " " : "_"))
    .join(" ");

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── CharDiff: chỉ show sau khi submit sai ───────────────────────────────────
const CharDiff = ({ input, target }) => {
  if (!input) return null;
  return (
    <div className="flex gap-0.5 justify-center flex-wrap mt-2">
      {target.split("").map((char, i) => {
        const inputChar = input[i];
        const isCorrect = inputChar && normalize(inputChar) === normalize(char);
        const isMissing = !inputChar;
        return (
          <span
            key={i}
            className={`text-lg font-mono font-bold px-0.5 ${
              isMissing
                ? "text-neutral-300 dark:text-neutral-700"
                : isCorrect
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-400 dark:text-red-500"
            }`}
          >
            {isMissing ? char : inputChar}
          </span>
        );
      })}
      {input.length > target.length &&
        input
          .slice(target.length)
          .split("")
          .map((c, i) => (
            <span
              key={`extra-${i}`}
              className="text-lg font-mono font-bold px-0.5 text-red-400 line-through"
            >
              {c}
            </span>
          ))}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const TypingGame = ({ words, onClose }) => {
  const validWords = useMemo(
    () => shuffle(words.filter((w) => w.meaning)),
    [words],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  // 'idle' | 'correct' | 'wrong' | 'revealed'
  const [status, setStatus] = useState("idle");
  const [hintLevel, setHintLevel] = useState(-1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showStreakBurst, setShowStreakBurst] = useState(false);
  // Chỉ show CharDiff khi đã submit sai
  const [showDiff, setShowDiff] = useState(false);

  const inputRef = useRef(null);
  const currentWord = validWords[currentIndex];

  useEffect(() => {
    if (!isFinished) setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentIndex, isFinished]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!currentWord && !isFinished) return null;

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (status !== "idle") return;
    if (!input.trim()) return;

    const isCorrect = normalize(input) === normalize(currentWord.word);

    if (isCorrect) {
      const points = hintLevel === -1 ? 2 : 1;
      setScore((p) => p + points);
      setStatus("correct");
      setShowDiff(false);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      if (newStreak > 0 && newStreak % 3 === 0) {
        setShowStreakBurst(true);
        setTimeout(() => setShowStreakBurst(false), 1200);
      }
      if (currentWord.audio_url) {
        setTimeout(() => new Audio(currentWord.audio_url).play(), 150);
      }
    } else {
      // Sai: show diff, reset status về idle để cho gõ lại
      setShowDiff(true);
      setStatus("wrong");
      setStreak(0);
      // Shake rồi về idle để gõ lại (không block)
      setTimeout(() => setStatus("idle"), 700);
    }
  };

  // ── Hint ──────────────────────────────────────────────────────────────────
  const handleHint = () => {
    if (status === "correct" || status === "revealed") return;
    const nextLevel = hintLevel + 1;
    if (nextLevel < currentWord.word.length - 1) {
      setHintLevel(nextLevel);
      setHintsUsed((p) => p + 1);
      setInput(currentWord.word.slice(0, nextLevel + 1));
      setShowDiff(false);
      inputRef.current?.focus();
    }
  };

  // ── Reveal ────────────────────────────────────────────────────────────────
  const handleReveal = () => {
    if (status === "correct" || status === "revealed") return;
    setStatus("revealed");
    setStreak(0);
    setShowDiff(false);
    setInput(currentWord.word);
  };

  // ── Next ──────────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentIndex + 1 >= validWords.length) {
      setIsFinished(true);
      return;
    }
    setCurrentIndex((p) => p + 1);
    setInput("");
    setStatus("idle");
    setHintLevel(-1);
    setShowDiff(false);
  };

  const playAudio = () => {
    if (currentWord?.audio_url) new Audio(currentWord.audio_url).play();
  };

  // ── Not enough words ──────────────────────────────────────────────────────
  if (validWords.length === 0) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl text-center max-w-sm border border-neutral-200 dark:border-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Cần ít nhất 1 từ vựng có dữ liệu để chơi.
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

  // ── Finish Screen ─────────────────────────────────────────────────────────
  if (isFinished) {
    const maxScore = validWords.length * 2;
    const percent = Math.round((score / maxScore) * 100);
    let grade = { label: "Xuất sắc! 🏆", color: "text-emerald-500" };
    if (percent < 80) grade = { label: "Tốt! 🎯", color: "text-blue-500" };
    if (percent < 60) grade = { label: "Khá! 💪", color: "text-amber-500" };
    if (percent < 40)
      grade = { label: "Cần luyện thêm 📖", color: "text-neutral-500" };

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950 animate-in fade-in">
        <div className="bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-neutral-100 dark:border-neutral-800 mx-4">
          <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100 dark:border-amber-800">
            <Trophy size={48} className="text-amber-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
            Hoàn thành!
          </h2>
          <p className={`text-lg font-bold mb-6 ${grade.color}`}>
            {grade.label}
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">
                {score}
                <span className="text-base text-neutral-300 dark:text-neutral-600">
                  /{maxScore}
                </span>
              </div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Điểm
              </div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">
                {maxStreak}
              </div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Streak
              </div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">
                {hintsUsed}
              </div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Gợi ý
              </div>
            </div>
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

  const isAnswered = status === "correct" || status === "revealed";
  const hintAvailable = hintLevel < currentWord.word.length - 2;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white dark:bg-neutral-950 animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
        >
          <X size={24} />
        </button>

        <div className="flex-1 mx-6 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neutral-900 dark:bg-white rounded-full"
            animate={{
              width: `${((currentIndex + 1) / validWords.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center gap-3">
          {streak >= 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1 text-sm font-bold text-orange-500"
            >
              <Flame size={16} className="fill-orange-400" /> {streak}
            </motion.div>
          )}
          <span className="text-sm font-bold text-neutral-900 dark:text-white tabular-nums">
            {score} điểm
          </span>
        </div>
      </div>

      {/* Streak burst */}
      <AnimatePresence>
        {showStreakBurst && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -20 }}
            exit={{ opacity: 0, scale: 0.5, y: -60 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] bg-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg pointer-events-none"
          >
            🔥 {streak} liên tiếp!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
        <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-8">
          {currentIndex + 1} / {validWords.length}
        </span>

        {/* Card */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-xl p-8 mb-8 text-center"
        >
          {currentWord.pos && (
            <span className="inline-block mb-4 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {currentWord.pos}
            </span>
          )}
          <p className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white leading-snug mb-4">
            {currentWord.meaning}
          </p>
          {currentWord.example && (
            <p className="text-sm text-neutral-400 dark:text-neutral-500 italic border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-4">
              "
              {currentWord.example.replace(
                new RegExp(currentWord.word, "gi"),
                "___",
              )}
              "
            </p>
          )}

          {/* Hint hiển thị trong card */}
          {hintLevel >= 0 && !isAnswered && (
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-xs text-neutral-400 mb-1 font-medium">Gợi ý</p>
              <p className="text-lg font-mono font-bold tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
                {buildHint(currentWord.word, hintLevel)}
              </p>
            </div>
          )}
        </motion.div>

        {/* Input / Result */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {!isAnswered ? (
              <motion.form
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative w-full max-w-sm">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      // Khi người dùng bắt đầu gõ lại sau khi sai → ẩn diff
                      if (showDiff) setShowDiff(false);
                    }}
                    placeholder="Nhập từ tiếng Anh..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className={`w-full text-center text-lg font-bold tracking-wide px-5 py-4 rounded-2xl border-2 bg-white dark:bg-neutral-900 outline-none transition-all duration-200 ${
                      status === "wrong"
                        ? "border-red-400 dark:border-red-600 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-neutral-900 dark:focus:border-white"
                    }`}
                  />

                  {/* Diff chỉ hiện SAU KHI submit sai */}
                  {showDiff && status !== "idle" && (
                    <CharDiff input={input} target={currentWord.word} />
                  )}

                  {/* Wrong hint text */}
                  {status === "wrong" && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 dark:text-red-400 font-medium text-center mt-2"
                    >
                      Chưa đúng, thử lại nhé!
                    </motion.p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || status === "wrong"}
                  className="px-10 py-3.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-base font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                >
                  Kiểm tra
                </button>

                <div className="flex items-center gap-4 mt-1">
                  {currentWord.audio_url && (
                    <button
                      type="button"
                      onClick={playAudio}
                      className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                    >
                      <Volume2 size={14} /> Nghe phát âm
                    </button>
                  )}
                  {hintAvailable && (
                    <button
                      type="button"
                      onClick={handleHint}
                      className="flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors"
                    >
                      <Lightbulb size={14} /> Gợi ý (-1 điểm)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleReveal}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    Bỏ qua / Xem đáp án
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-5"
              >
                <div
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-base ${
                    status === "correct"
                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {status === "correct" ? (
                    <>
                      <CheckCircle2 size={22} className="text-green-500" />
                      Chính xác! +{hintLevel === -1 ? 2 : 1} điểm
                    </>
                  ) : (
                    <>
                      <XCircle size={22} className="text-neutral-400" />
                      Đáp án:{" "}
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {currentWord.word}
                      </span>
                      {currentWord.ipa && (
                        <span className="font-mono text-sm text-neutral-400">
                          [{currentWord.ipa}]
                        </span>
                      )}
                    </>
                  )}
                </div>

                {currentWord.audio_url && (
                  <button
                    onClick={playAudio}
                    className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                  >
                    <Volume2 size={14} /> Nghe phát âm
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="flex items-center gap-3 px-10 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-base font-bold rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:-translate-y-1 transition-all"
                >
                  {currentIndex === validWords.length - 1
                    ? "Xem kết quả"
                    : "Từ tiếp theo"}
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TypingGame;
