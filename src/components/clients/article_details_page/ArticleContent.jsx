import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Square, Volume2 } from "lucide-react";

const ArticleContent = ({ paragraphs }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const currentWordIndexRef = useRef(0);
  const [, forceRender] = useState(0);
  const utteranceRef = useRef(null);

  // ... (Logic giữ nguyên như cũ của bạn) ...
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakParagraphs = (startIndex = 0) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setCurrentParagraph(startIndex);
    currentWordIndexRef.current = 0;

    const speakNext = (index) => {
      if (index >= paragraphs.length) {
        setIsSpeaking(false);
        return;
      }
      const p = paragraphs[index];
      const utterance = new SpeechSynthesisUtterance(p.text_en);
      utteranceRef.current = utterance;

      utterance.onstart = () => {
        setCurrentParagraph(index);
        currentWordIndexRef.current = 0;
        forceRender((r) => r + 1);
      };

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          let textUpToChar = p.text_en.slice(0, event.charIndex).trim();
          let wordIndex = textUpToChar ? textUpToChar.split(/\s+/).length : 0;
          currentWordIndexRef.current = wordIndex;
          forceRender((r) => r + 1);
        }
      };

      utterance.onend = () => speakNext(index + 1);
      window.speechSynthesis.speak(utterance);
    };

    speakNext(startIndex);
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentParagraph(0);
    currentWordIndexRef.current = 0;
  };

  return (
    <div className="relative">
      {/* Sticky Audio Controls Toolbar */}
      <div className="sticky top-24 z-30 mb-8 flex justify-end pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md border border-neutral-200 shadow-lg rounded-full p-1.5 flex items-center gap-1">
          {!isSpeaking ? (
            <button
              onClick={() => speakParagraphs(currentParagraph)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all font-medium text-sm shadow-sm"
            >
              <Play size={16} fill="currentColor" />
              <span>Đọc bài</span>
            </button>
          ) : (
            <button
              onClick={pauseSpeech}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all font-medium text-sm shadow-sm"
            >
              <Pause size={16} fill="currentColor" />
              <span>Tạm dừng</span>
            </button>
          )}

          <div className="w-px h-6 bg-neutral-200 mx-1"></div>

          <button
            onClick={resumeSpeech}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
            title="Tiếp tục"
          >
            <Play size={18} />
          </button>

          <button
            onClick={stopSpeech}
            className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Dừng hẳn"
          >
            <Square size={18} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Paragraphs List */}
      <div className="space-y-6">
        {paragraphs?.map((p, index) => {
          const isCurrent = index === currentParagraph;

          // Style highlights
          const containerClass = isCurrent
            ? "bg-neutral-50 border-l-4 border-neutral-900 pl-4 py-2 pr-2 rounded-r-xl" // Highlight Style
            : "bg-transparent border-l-4 border-transparent pl-4 py-0 pr-0"; // Normal Style

          return (
            <div
              key={p.id}
              className={`transition-all duration-500 ease-in-out ${containerClass}`}
            >
              <p className="text-lg md:text-xl text-neutral-800 leading-loose font-serif">
                {isCurrent
                  ? // Active Paragraph Rendering
                    p.text_en.split(/\s+/).map((word, i) => (
                      <span
                        key={i}
                        className={`
                        transition-colors duration-150 rounded px-0.5
                        ${
                          i === currentWordIndexRef.current
                            ? "bg-yellow-200 text-neutral-900 font-medium"
                            : ""
                        }
                      `}
                      >
                        {word}{" "}
                      </span>
                    ))
                  : // Inactive Paragraph
                    p.text_en}
              </p>
            </div>
          );
        })}
      </div>

      {/* Audio Status Footer */}
      <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400 font-medium border-t border-neutral-100 pt-4">
        <Volume2 size={14} />
        {paragraphs && paragraphs[currentParagraph]
          ? `Đang đọc đoạn ${currentParagraph + 1} / ${paragraphs.length}`
          : "Sẵn sàng đọc"}
      </div>
    </div>
  );
};

export default ArticleContent;
