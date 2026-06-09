import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { X, Trophy, Heart, Zap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_LIVES = 3;
const INITIAL_SPEED = 14; // giây để rơi hết màn hình
const SPEED_INCREMENT = 0.8; // nhân tốc độ sau mỗi 5 câu đúng
const MIN_SPEED = 5; // tốc độ tối đa (giây)
const OPTION_COUNT = 4;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── Sub: Lives display ───────────────────────────────────────────────────────
const Lives = ({ count }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
      <motion.div
        key={i}
        animate={
          i >= count
            ? { scale: [1, 1.3, 0.8], opacity: 0.25 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.35 }}
      >
        <Heart
          size={20}
          className={
            i < count
              ? "text-red-500 fill-red-500"
              : "text-neutral-300 dark:text-neutral-700"
          }
        />
      </motion.div>
    ))}
  </div>
);

// ─── Sub: Falling word card ───────────────────────────────────────────────────
const FallingWord = ({ word, ipa, duration, onAnimationEnd }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 top-0 z-10"
    initial={{ y: -80 }}
    animate={{ y: "calc(100vh - 220px)" }}
    transition={{ duration, ease: "linear" }}
    onAnimationComplete={onAnimationEnd}
  >
    <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-white px-6 py-3 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.06)] text-center min-w-[140px]">
      <p className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
        {word}
      </p>
      {ipa && (
        <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
          {ipa}
        </p>
      )}
    </div>
    {/* Shadow "danger" line indicator */}
    <motion.div
      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neutral-900 dark:bg-white opacity-20"
      animate={{ scale: [1, 1.5, 1] }}
      transition={{ repeat: Infinity, duration: 1 }}
    />
  </motion.div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const SpeedRoundGame = ({ words, onClose }) => {
  const validWords = useMemo(() => words.filter((w) => w.meaning), [words]);

  // Queue câu hỏi (shuffle một lần)
  const questionQueue = useMemo(() => shuffle(validWords), [validWords]);

  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [speedLevel, setSpeedLevel] = useState(0); // số lần tăng tốc
  const [fallingKey, setFallingKey] = useState(0); // key để reset animation
  const [status, setStatus] = useState("playing"); // 'playing' | 'correct' | 'wrong' | 'missed' | 'finished'
  const [flashResult, setFlashResult] = useState(null); // 'correct' | 'wrong'
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const currentWord = questionQueue[qIndex];

  // Tạo options cho câu hỏi hiện tại
  const options = useMemo(() => {
    if (!currentWord) return [];
    const others = validWords
      .filter((w) => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, OPTION_COUNT - 1);
    return shuffle([currentWord, ...others]);
  }, [currentWord, validWords]);

  // Tốc độ hiện tại (giây)
  const currentDuration = Math.max(
    MIN_SPEED,
    INITIAL_SPEED * Math.pow(SPEED_INCREMENT, speedLevel),
  );

  // ── Khi từ chạm đáy (missed) ──────────────────────────────────────────────
  const handleMissed = useCallback(() => {
    if (answered) return;
    setFlashResult("wrong");
    setCombo(0);
    const newLives = lives - 1;
    setLives(newLives);

    setTimeout(() => {
      setFlashResult(null);
      if (newLives <= 0) {
        setIsFinished(true);
      } else {
        goNext();
      }
    }, 600);
  }, [answered, lives]);

  // ── Chọn đáp án ───────────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (option) => {
      if (answered) return;
      setAnswered(true);

      const isCorrect = option.id === currentWord.id;
      setFlashResult(isCorrect ? "correct" : "wrong");

      if (isCorrect) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        const bonus = newCombo >= 3 ? 2 : 1; // combo bonus
        setScore((p) => p + bonus);
        // Tăng tốc mỗi 5 đúng liên tiếp
        if (newCombo > 0 && newCombo % 5 === 0) {
          setSpeedLevel((p) => p + 1);
        }
      } else {
        setCombo(0);
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) {
          setTimeout(() => setIsFinished(true), 700);
          return;
        }
      }

      setTimeout(() => {
        setFlashResult(null);
        goNext();
      }, 600);
    },
    [answered, combo, currentWord, lives, maxCombo],
  );

  const goNext = useCallback(() => {
    const nextIdx = qIndex + 1;
    if (nextIdx >= questionQueue.length) {
      setIsFinished(true);
      return;
    }
    setQIndex(nextIdx);
    setAnswered(false);
    setFallingKey((k) => k + 1);
  }, [qIndex, questionQueue.length]);

  // ── Not enough words ───────────────────────────────────────────────────────
  if (validWords.length < OPTION_COUNT) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl text-center max-w-sm border border-neutral-200 dark:border-neutral-800">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Cần ít nhất {OPTION_COUNT} từ vựng có dữ liệu để chơi.
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

  // ── Finish Screen ──────────────────────────────────────────────────────────
  if (isFinished) {
    const accuracy =
      questionQueue.length > 0
        ? Math.round(
            (score / Math.max(score + (INITIAL_LIVES - lives), 1)) * 100,
          )
        : 0;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950 animate-in fade-in">
        <div className="bg-white dark:bg-neutral-900 p-10 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-neutral-100 dark:border-neutral-800 mx-4">
          <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100 dark:border-amber-800">
            <Trophy size={48} className="text-amber-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">
            Game over!
          </h2>
          <p className="text-neutral-400 dark:text-neutral-500 text-sm mb-8">
            {lives > 0 ? "Đã hoàn thành tất cả từ vựng 🎉" : "Hết tim rồi!"}
          </p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">
                {score}
              </div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Điểm
              </div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5 flex items-center justify-center gap-1">
                <Zap size={18} className="text-amber-400" />
                {maxCombo}x
              </div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Max combo
              </div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">
                {speedLevel + 1}
              </div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Tốc độ
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

  // ── Flash overlay màu khi đúng/sai ────────────────────────────────────────
  const overlayColor =
    flashResult === "correct"
      ? "bg-green-400/10 dark:bg-green-400/10"
      : flashResult === "wrong"
        ? "bg-red-400/10 dark:bg-red-400/10"
        : "bg-transparent";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col bg-white dark:bg-neutral-950 transition-colors duration-150 ${overlayColor}`}
    >
      {/* ── Header ── */}
      <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
        >
          <X size={24} />
        </button>

        {/* Center: speed indicator */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Tốc độ
          </span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(speedLevel + 1, 6) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Combo badge */}
          <AnimatePresence>
            {combo >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold"
              >
                <Zap size={12} /> {combo}x
              </motion.div>
            )}
          </AnimatePresence>

          {/* Score */}
          <span className="text-base font-bold text-neutral-900 dark:text-white tabular-nums">
            {score}
          </span>

          {/* Lives */}
          <Lives count={lives} />
        </div>
      </div>

      {/* ── Falling zone ── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Danger zone line ở đáy */}
        <div className="absolute bottom-[160px] left-0 right-0 border-t-2 border-dashed border-red-300/50 dark:border-red-800/50 z-0" />
        <div className="absolute bottom-[150px] left-4 text-[10px] font-bold text-red-400/60 dark:text-red-700/60 uppercase tracking-widest">
          Vùng nguy hiểm
        </div>

        {/* Falling word */}
        {currentWord && (
          <FallingWord
            key={fallingKey}
            word={currentWord.word}
            ipa={currentWord.ipa}
            duration={currentDuration}
            onAnimationEnd={handleMissed}
          />
        )}

        {/* Result flash text */}
        <AnimatePresence>
          {flashResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -30 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            >
              <span
                className={`text-3xl font-black ${
                  flashResult === "correct" ? "text-green-500" : "text-red-500"
                }`}
              >
                {flashResult === "correct"
                  ? combo >= 3
                    ? `+${combo >= 3 ? 2 : 1} 🔥`
                    : "+1"
                  : "✕"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Answer options (fixed bottom) ── */}
      <div className="shrink-0 p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 gap-2.5 max-w-xl mx-auto">
          {options.map((option) => {
            let btnClass =
              "w-full px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold text-left leading-snug transition-all duration-150 active:scale-[0.97]";

            if (flashResult && answered) {
              if (option.id === currentWord.id) {
                btnClass +=
                  " bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300";
              } else {
                btnClass +=
                  " bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 opacity-50";
              }
            } else {
              btnClass +=
                " bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-900 dark:hover:border-white hover:shadow-md hover:-translate-y-0.5";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={btnClass}
              >
                {option.meaning}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SpeedRoundGame;
