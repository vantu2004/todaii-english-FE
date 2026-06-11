import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { X, Trophy, Heart, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_LIVES = 3;
const INITIAL_DURATION = 14;
const SPEED_FACTOR = 0.82;
const MIN_DURATION = 4.5;
const OPTION_COUNT = 4;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ─── Sub: Lives ───────────────────────────────────────────────────────────────
const Lives = ({ count }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: INITIAL_LIVES }).map((_, i) => (
      <motion.div
        key={i}
        animate={
          i >= count
            ? { scale: [1, 1.4, 0.7], opacity: 0.2 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.3 }}
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

// ─── Main ─────────────────────────────────────────────────────────────────────
const SpeedRoundGame = ({ words, onClose }) => {
  const validWords = useMemo(() => words.filter((w) => w.meaning), [words]);
  const questionQueue = useMemo(() => shuffle(validWords), [validWords]);

  const [qIndex, setQIndex] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [speedLevel, setSpeedLevel] = useState(0);
  const [fallingKey, setFallingKey] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [flashResult, setFlashResult] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const answeredRef = useRef(false);
  const livesRef = useRef(INITIAL_LIVES);
  const missTimer = useRef(null);

  const currentWord = questionQueue[qIndex];

  const getDuration = useCallback(
    (level) =>
      Math.max(MIN_DURATION, INITIAL_DURATION * Math.pow(SPEED_FACTOR, level)),
    [],
  );

  const options = useMemo(() => {
    if (!currentWord) return [];
    const others = shuffle(
      validWords.filter((w) => w.id !== currentWord.id),
    ).slice(0, OPTION_COUNT - 1);
    return shuffle([currentWord, ...others]);
  }, [currentWord, validWords]);

  useEffect(() => {
    answeredRef.current = answered;
  }, [answered]);
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  // goNext và handleMiss dùng useRef để tránh stale closure
  const speedLevelRef = useRef(0);
  useEffect(() => {
    speedLevelRef.current = speedLevel;
  }, [speedLevel]);

  const goNext = useCallback(
    (nextQIdx, nextSpeedLevel) => {
      clearTimeout(missTimer.current);
      if (nextQIdx >= questionQueue.length) {
        setIsFinished(true);
        return;
      }
      setQIndex(nextQIdx);
      setAnswered(false);
      answeredRef.current = false;
      setFallingKey((k) => k + 1);

      const dur = Math.max(
        MIN_DURATION,
        INITIAL_DURATION * Math.pow(SPEED_FACTOR, nextSpeedLevel),
      );
      missTimer.current = setTimeout(
        () => {
          if (!answeredRef.current) {
            // miss
            setAnswered(true);
            answeredRef.current = true;
            setFlashResult("wrong");
            setCombo(0);
            const newLives = livesRef.current - 1;
            setLives(newLives);
            livesRef.current = newLives;
            setTimeout(() => {
              setFlashResult(null);
              if (newLives <= 0) {
                setIsFinished(true);
                return;
              }
              goNext(nextQIdx + 1, speedLevelRef.current);
            }, 600);
          }
        },
        dur * 1000 + 80,
      );
    },
    [questionQueue.length],
  );

  // Start first question
  useEffect(() => {
    if (validWords.length < OPTION_COUNT) return;
    const dur = getDuration(0);
    missTimer.current = setTimeout(
      () => {
        if (!answeredRef.current) {
          setAnswered(true);
          answeredRef.current = true;
          setFlashResult("wrong");
          setCombo(0);
          const newLives = livesRef.current - 1;
          setLives(newLives);
          livesRef.current = newLives;
          setTimeout(() => {
            setFlashResult(null);
            if (newLives <= 0) {
              setIsFinished(true);
              return;
            }
            goNext(1, 0);
          }, 600);
        }
      },
      dur * 1000 + 80,
    );
    return () => clearTimeout(missTimer.current);
  }, []); // eslint-disable-line

  const handleAnswer = useCallback(
    (option) => {
      if (answered) return;
      clearTimeout(missTimer.current);
      setAnswered(true);
      answeredRef.current = true;

      const isCorrect = option.id === currentWord.id;
      setFlashResult(isCorrect ? "correct" : "wrong");

      let nextLives = livesRef.current;
      let nextCombo = combo;
      let nextSpeedLevel = speedLevelRef.current;

      if (isCorrect) {
        nextCombo = combo + 1;
        const pts = nextCombo >= 3 ? 2 : 1;
        setScore((p) => p + pts);
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);
        if (nextCombo > 0 && nextCombo % 5 === 0) {
          nextSpeedLevel = Math.min(5, speedLevelRef.current + 1);
          setSpeedLevel(nextSpeedLevel);
          speedLevelRef.current = nextSpeedLevel;
        }
      } else {
        nextCombo = 0;
        nextLives = livesRef.current - 1;
        setCombo(0);
        setLives(nextLives);
        livesRef.current = nextLives;
      }

      setTimeout(() => {
        setFlashResult(null);
        if (!isCorrect && nextLives <= 0) {
          setIsFinished(true);
          return;
        }
        goNext(qIndex + 1, nextSpeedLevel);
      }, 650);
    },
    [answered, currentWord, combo, maxCombo, qIndex, goNext],
  );

  useEffect(() => () => clearTimeout(missTimer.current), []);

  // ── Not enough words ──────────────────────────────────────────────────────
  if (validWords.length < OPTION_COUNT) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950">
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

  // ── Finish Screen ─────────────────────────────────────────────────────────
  if (isFinished) {
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
                <Zap size={16} className="text-amber-400" />
                {maxCombo}x
              </div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                Combo
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
            className="w-full py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all hover:-translate-y-1"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const duration = getDuration(speedLevel);
  const overlayBg =
    flashResult === "correct"
      ? "bg-green-400/10"
      : flashResult === "wrong"
        ? "bg-red-400/10"
        : "";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col bg-white dark:bg-neutral-950 transition-colors duration-150 ${overlayBg}`}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Tốc độ
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                animate={
                  i <= speedLevel
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.7, opacity: 0.15 }
                }
                transition={{ duration: 0.3 }}
                className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
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
          <span className="text-base font-bold text-neutral-900 dark:text-white tabular-nums">
            {score}
          </span>
          <Lives count={lives} />
        </div>
      </div>

      {/* Fall zone */}
      <div className="relative flex-1 overflow-hidden bg-white dark:bg-neutral-950">
        <div className="absolute bottom-[164px] left-0 right-0 border-t-2 border-dashed border-red-300/60 dark:border-red-800/60 pointer-events-none" />
        <span className="absolute bottom-[148px] left-5 text-[10px] font-bold text-red-400/70 dark:text-red-700/70 uppercase tracking-widest pointer-events-none">
          Vùng nguy hiểm
        </span>

        {currentWord && (
          <motion.div
            key={fallingKey}
            className="absolute left-1/2 -translate-x-1/2"
            initial={{ y: -80 }}
            animate={{ y: "calc(100vh - 230px)" }}
            transition={{ duration, ease: "linear" }}
          >
            <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-white px-6 py-3 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] text-center min-w-[150px]">
              <p className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {currentWord.word}
              </p>
              {currentWord.ipa && (
                <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {currentWord.ipa}
                </p>
              )}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {flashResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -40 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
            >
              <span
                className={`text-4xl font-black ${flashResult === "correct" ? "text-green-500" : "text-red-500"}`}
              >
                {flashResult === "correct" ? (combo >= 3 ? "+2" : "+1") : "✕"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options */}
      <div className="shrink-0 p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-2 gap-2.5 max-w-xl mx-auto">
          {options.map((option) => {
            let cls =
              "w-full px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold text-left leading-snug transition-all duration-150 active:scale-[0.97]";
            if (flashResult && answered) {
              if (option.id === currentWord.id)
                cls +=
                  " bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-800 dark:text-green-300";
              else
                cls +=
                  " bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 opacity-50";
            } else {
              cls +=
                " bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-900 dark:hover:border-white hover:shadow-md hover:-translate-y-0.5 cursor-pointer";
            }
            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={cls}
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
