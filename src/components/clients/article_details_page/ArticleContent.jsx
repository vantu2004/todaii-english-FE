import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  Languages,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import VoiceSelector from "./VoiceSelector";
import DictionaryModal from "@/components/clients/DictionaryModal";

const ArticleContent = ({ paragraphs, audioUrl }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const currentWordIndexRef = useRef(0);
  const [, forceRender] = useState(0);
  const utteranceRef = useRef(null);
  const [lookupWord, setLookupWord] = useState("");
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const [audioMode, setAudioMode] = useState("browser"); // "browser" | "ai"
  const [aiAudio, setAiAudio] = useState(null);
  const [isPlayingAi, setIsPlayingAi] = useState(false);

  const playAiVoice = () => {
    if (!audioUrl) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (aiAudio) {
      aiAudio
        .play()
        .then(() => {
          setIsPlayingAi(true);
        })
        .catch((err) => {
          console.error("AI Audio playback failed", err);
        });
    } else {
      const audio = new Audio(audioUrl);
      audio
        .play()
        .then(() => {
          setIsPlayingAi(true);
        })
        .catch((err) => {
          console.error("AI Audio playback failed", err);
        });
      audio.onended = () => {
        setIsPlayingAi(false);
      };
      setAiAudio(audio);
    }
  };

  const pauseAiVoice = () => {
    if (aiAudio) {
      aiAudio.pause();
      setIsPlayingAi(false);
    }
  };

  const stopAiVoice = () => {
    if (aiAudio) {
      aiAudio.pause();
      aiAudio.currentTime = 0;
      setIsPlayingAi(false);
    }
  };

  const handleModeChange = (mode) => {
    stopSpeech();
    stopAiVoice();
    setAudioMode(mode);
  };

  const handleWordClick = (word) => {
    const cleaned = word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
    if (cleaned) {
      setLookupWord(cleaned);
      setIsLookupOpen(true);
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis
        .getVoices()
        .filter((v) => v.lang.startsWith("en"));

      const preferredVoices = [
        "Microsoft Aria",
        "Microsoft Davis",
        "Microsoft Guy",
        "Microsoft Jenny",
        "Google US English",
        "Google UK English Female",
      ];

      let filteredVoices = allVoices.filter(
        (v) =>
          preferredVoices.some((prefName) => v.name.includes(prefName)) &&
          !v.name.toLowerCase().includes("multilingual"),
      );

      // Fallback to all English voices if no preferred premium voice is available
      if (filteredVoices.length === 0) {
        filteredVoices = allVoices;
      }

      setVoices(filteredVoices);

      let defaultVoice = null;
      for (const name of preferredVoices) {
        const found = filteredVoices.find((v) => v.name.includes(name));
        if (found) {
          defaultVoice = found;
          break;
        }
      }

      setSelectedVoice((prev) => {
        if (prev && filteredVoices.some((v) => v.name === prev.name)) {
          return prev;
        }
        return (
          defaultVoice ||
          filteredVoices.find((v) => v.lang.startsWith("en-US")) ||
          filteredVoices[0]
        );
      });
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // State quản lý việc ẩn/hiện dịch của từng đoạn (key: index, value: boolean)
  const [showTranslations, setShowTranslations] = useState({});

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (aiAudio) {
        aiAudio.pause();
      }
    };
  }, [aiAudio]);

  useEffect(() => {
    if (aiAudio) {
      aiAudio.pause();
      setAiAudio(null);
      setIsPlayingAi(false);
    }
  }, [audioUrl]);

  const toggleTranslation = (index) => {
    setShowTranslations((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // --- LOGIC TTS (Giữ nguyên) ---
  const speakParagraphs = (startIndex = 0) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
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
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = "en-US";
      }
      utterance.rate = 0.9;
      utterance.pitch = 1;
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
    window.speechSynthesis.pause();
    setIsSpeaking(false);
  };

  const resumeSpeech = () => {
    window.speechSynthesis.resume();
    setIsSpeaking(true);
  };

  const stopSpeech = () => {
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentParagraph(0);
    currentWordIndexRef.current = 0;
  };

  const activePlaying = audioMode === "ai" ? isPlayingAi : isSpeaking;

  return (
    <div className="relative">
      {/* Sticky Audio Controls Toolbar */}
      <div className="sticky top-24 z-30 mb-6 flex justify-end pointer-events-none">
        <div className="pointer-events-auto bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 shadow-lg dark:shadow-none rounded-lg p-1 flex items-center gap-0.5 sm:gap-1">
          {audioUrl && (
            <select
              value={audioMode}
              onChange={(e) => handleModeChange(e.target.value)}
              className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-brand-500 mr-0.5 sm:mr-1 cursor-pointer font-medium max-w-[90px] sm:max-w-none flex-shrink-0"
            >
              <option value="browser">Hệ thống</option>
              <option value="ai">AI Voice</option>
            </select>
          )}

          {!activePlaying ? (
            <button
              onClick={() => {
                if (audioMode === "ai") {
                  playAiVoice();
                } else {
                  speakParagraphs(currentParagraph);
                }
              }}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium text-xs sm:text-sm shadow-sm dark:shadow-none flex-shrink-0"
            >
              <Play size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
              <span className="hidden sm:inline">Đọc bài</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (audioMode === "ai") {
                  pauseAiVoice();
                } else {
                  pauseSpeech();
                }
              }}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors font-medium text-xs sm:text-sm shadow-sm dark:shadow-none flex-shrink-0"
            >
              <Pause size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
              <span className="hidden sm:inline">Tạm dừng</span>
            </button>
          )}

          {audioMode === "browser" && (
            <VoiceSelector
              voices={voices}
              selectedVoice={selectedVoice}
              onChange={setSelectedVoice}
            />
          )}

          <div className="w-px h-6 bg-neutral-200 mx-1 flex-shrink-0"></div>

          <button
            onClick={() => {
              if (audioMode === "ai") {
                playAiVoice();
              } else {
                resumeSpeech();
              }
            }}
            className="p-1 sm:p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors flex-shrink-0"
            title="Tiếp tục"
          >
            <Play size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>

          <button
            onClick={() => {
              if (audioMode === "ai") {
                stopAiVoice();
              } else {
                stopSpeech();
              }
            }}
            className="p-1 sm:p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors flex-shrink-0"
            title="Dừng hẳn"
          >
            <Square
              size={16}
              className="sm:w-[18px] sm:h-[18px]"
              fill="currentColor"
            />
          </button>
        </div>
      </div>

      {/* Paragraphs List */}
      <div className="space-y-6">
        {paragraphs?.map((p, index) => {
          const isCurrent = index === currentParagraph;
          const isTranslated = showTranslations[index];

          // Style highlights container
          const containerClass = isCurrent
            ? "bg-neutral-50 dark:bg-neutral-800/50 border-l-2 border-neutral-900 dark:border-neutral-400 pl-4 py-3 pr-3 rounded-r-lg shadow-sm dark:shadow-none"
            : "bg-transparent border-l-2 border-transparent pl-3 py-0 pr-0";

          return (
            <div
              key={p.id}
              className={`transition-all duration-500 ease-in-out group ${containerClass}`}
            >
              {/* ENGLISH TEXT */}
              <p className="text-lg md:text-xl text-neutral-900 dark:text-neutral-100 leading-loose font-serif mb-3">
                {isCurrent
                  ? // Active Paragraph Rendering (Highlight word + Clickable)
                    p.text_en?.split(/\s+/).map((word, i) => (
                      <span
                        key={i}
                        onClick={() => handleWordClick(word)}
                        className={`
                          cursor-pointer hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-150 rounded px-0.5
                          ${
                            i === currentWordIndexRef.current
                              ? "bg-yellow-200 dark:bg-yellow-500/30 text-neutral-900 dark:text-white font-medium"
                              : ""
                          }
                        `}
                      >
                        {word}{" "}
                      </span>
                    ))
                  : // Inactive Paragraph (Clickable)
                    p.text_en?.split(/\s+/).map((word, i) => (
                      <span
                        key={i}
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-150 rounded px-0.5"
                      >
                        {word}{" "}
                      </span>
                    ))}
              </p>

              {/* VIETNAMESE TRANSLATION (Collapsible) */}
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${
                    isTranslated
                      ? "max-h-[500px] opacity-100 mt-4"
                      : "max-h-0 opacity-0 mt-0"
                  }
                `}
              >
                <div className="bg-white/50 dark:bg-transparent border-t border-dashed border-neutral-300 dark:border-neutral-700 pt-3">
                  <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans italic">
                    {p.text_vi_system}
                  </p>
                </div>
              </div>

              {/* TOGGLE BUTTON */}
              <div className="mt-2 flex justify-end transition-opacity duration-300">
                <button
                  onClick={() => toggleTranslation(index)}
                  className={`
                    flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-wide transition-colors
                    ${
                      isTranslated
                        ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-900 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                    }
                  `}
                >
                  <Languages size={14} />
                  <span>{isTranslated ? "Ẩn dịch" : "Dịch nghĩa"}</span>
                  {isTranslated ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Audio Status Footer */}
      <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 font-medium border-t border-neutral-100 dark:border-neutral-800 pt-4">
        <Volume2 size={14} />
        {audioMode === "ai"
          ? isPlayingAi
            ? "Đang phát giọng đọc AI"
            : "Giọng đọc AI sẵn sàng"
          : paragraphs && paragraphs[currentParagraph]
            ? `Đang đọc đoạn ${currentParagraph + 1} / ${paragraphs.length}`
            : "Sẵn sàng đọc"}
      </div>

      <DictionaryModal
        word={lookupWord}
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />
    </div>
  );
};

export default ArticleContent;
