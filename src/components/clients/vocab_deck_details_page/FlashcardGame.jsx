import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Volume2, X } from "lucide-react";
import { motion } from "framer-motion";

const FlashcardGame = ({ words, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = words[currentIndex];

  // Reset trạng thái lật khi chuyển từ
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Hỗ trợ phím tắt (Mũi tên trái/phải để chuyển, Space/Enter để lật)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " " || e.key === "Enter") handleFlip();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, words.length]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const playAudio = (e) => {
    e.stopPropagation();
    if (currentWord?.audio_url) {
      new Audio(currentWord.audio_url).play();
    }
  };

  if (!currentWord) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-neutral-50 animate-in fade-in duration-200">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900">Flashcard</h2>
        <div className="px-3 py-1 rounded-full bg-neutral-100 text-xs font-bold text-neutral-600">
          {currentIndex + 1} / {words.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Card Container */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Aspect Ratio Container */}
        <div className="w-full max-w-xl aspect-[4/3] sm:aspect-[3/2] perspective-1000">
          <motion.div
            className="relative w-full h-full cursor-pointer"
            onClick={handleFlip}
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* --- FRONT SIDE (English) --- */}
            <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-2xl border border-neutral-100 flex flex-col items-center justify-center p-8 backface-hidden select-none">
              <span className="text-neutral-300 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                Từ vựng
              </span>

              <h3 className="text-4xl sm:text-6xl font-black text-neutral-900 mb-4 text-center break-words max-w-full">
                {currentWord.word}
              </h3>

              <div className="flex items-center gap-3 mt-2">
                {currentWord.ipa && (
                  <span className="text-lg text-neutral-400 font-mono bg-neutral-50 px-3 py-1 rounded-lg border border-neutral-100">
                    {currentWord.ipa}
                  </span>
                )}
                {currentWord.audio_url && (
                  <button
                    onClick={playAudio}
                    className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg hover:bg-neutral-800"
                    title="Nghe phát âm"
                  >
                    <Volume2 size={20} />
                  </button>
                )}
              </div>

              <p className="mt-auto text-neutral-300 text-xs flex items-center gap-2 font-medium">
                <RotateCw size={12} /> Chạm để lật
              </p>
            </div>

            {/* --- BACK SIDE (Vietnamese & Example) --- */}
            <div
              className="absolute inset-0 bg-neutral-900 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-8 backface-hidden text-white select-none border border-neutral-800"
              style={{ transform: "rotateY(180deg)" }}
            >
              <span className="text-neutral-600 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                Nghĩa của từ
              </span>

              <div className="mb-4 px-3 py-1 rounded-full border border-neutral-700 text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                {currentWord.pos}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-center mb-6 leading-snug max-w-md text-white/90">
                {currentWord.meaning}
              </h3>

              {currentWord.example && (
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 max-w-md text-center w-full">
                  <p className="text-neutral-300 italic text-sm sm:text-base leading-relaxed">
                    "{currentWord.example}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-6 bg-white border-t border-neutral-200 flex justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-200 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-neutral-600 text-sm hover:border-neutral-300"
        >
          <ArrowLeft size={18} /> Trước
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === words.length - 1}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm shadow-xl shadow-neutral-200 hover:-translate-y-0.5"
        >
          Tiếp theo <ArrowRight size={18} />
        </button>
      </div>

      {/* Utility CSS for 3D Flip */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default FlashcardGame;
