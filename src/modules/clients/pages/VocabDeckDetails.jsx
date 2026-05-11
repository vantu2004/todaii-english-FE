import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PlayCircle,
  Gamepad2,
  Volume2,
  Shuffle,
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { getVocabDeckById } from "@/api/clients/vocabDeckApi"; // Đường dẫn API của bạn
import FlashcardGame from "@/components/clients/vocab_deck_details_page/FlashcardGame";
import QuizGame from "@/components/clients/vocab_deck_details_page/QuizGame";
import { formatISODate } from "@/utils/FormatDate";

const VocabDeckDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [deck, setDeck] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list"); // 'list' | 'flashcard' | 'quiz'

  // List Control States
  const [showMeaning, setShowMeaning] = useState(true);
  const [showWord, setShowWord] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getVocabDeckById(id);
        if (res) {
          setDeck(res);
          // Map dữ liệu từ API (snake_case) sang cấu trúc phẳng hơn để dễ render
          const mappedWords = (res.words || []).map((w) => ({
            id: w.id,
            word: w.headword,
            ipa: w.ipa,
            audio_url: w.audio_url,
            // Lấy sense đầu tiên làm nghĩa chính
            pos: w.senses?.[0]?.pos || "N/A",
            meaning: w.senses?.[0]?.meaning || "Chưa cập nhật nghĩa",
            definition: w.senses?.[0]?.definition,
            example: w.senses?.[0]?.example,
          }));
          setWords(mappedWords);
        }
      } catch (error) {
        console.error("Failed to load deck", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- HANDLERS ---
  const handleShuffle = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
  };

  const playAudio = (e, url) => {
    e.stopPropagation();
    if (url) new Audio(url).play();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <Loader2 className="animate-spin text-neutral-400 dark:text-neutral-500" size={32} />
      </div>
    );
  }

  if (!deck) return null; // Hoặc PageNotFound

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-neutral-950 pt-24 pb-12 px-4 sm:px-6 font-sans">
      {/* --- GAME MODES OVERLAY --- */}
      {mode === "flashcard" && (
        <FlashcardGame words={words} onClose={() => setMode("list")} />
      )}
      {mode === "quiz" && (
        <QuizGame words={words} onClose={() => setMode("list")} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER --- */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} /> Quay lại thư viện
          </button>

          <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-neutral-900 text-white text-xs font-bold border border-neutral-900">
                  {deck.cefr_level}
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white tracking-tight">
                  {deck.name}
                </h1>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl text-sm leading-relaxed mb-2">
                {deck.description}
              </p>
              <div className="text-xs text-neutral-400 dark:text-neutral-500 font-medium flex gap-3">
                <span>{words.length} từ vựng</span>
                <span>•</span>
                <span>Cập nhật: {formatISODate(deck.updated_at)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMode("flashcard")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
              >
                <PlayCircle size={18} /> Flashcard
              </button>
              <button
                onClick={() => setMode("quiz")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-neutral-700 dark:text-neutral-300 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
              >
                <Gamepad2 size={18} /> Trắc nghiệm
              </button>
            </div>
          </div>
        </div>

        {/* --- LIST CONTROLS (Sticky) --- */}
        <div className="sticky top-24 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Toggles */}
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => setShowWord(!showWord)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                showWord
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                  : "bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              {showWord ? <Eye size={14} /> : <EyeOff size={14} />} Từ vựng
            </button>
            <button
              onClick={() => setShowMeaning(!showMeaning)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                showMeaning
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                  : "bg-transparent text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              {showMeaning ? <Eye size={14} /> : <EyeOff size={14} />} Định
              nghĩa
            </button>
          </div>

          {/* Right: Shuffle */}
          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors mr-2"
          >
            <Shuffle size={14} /> Trộn danh sách
          </button>
        </div>

        {/* --- WORD LIST --- */}
        <div className="space-y-3">
          {words.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-neutral-900/60 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-md transition-all duration-300 flex items-start sm:items-center gap-4"
            >
              {/* Audio Button */}
              <button
                onClick={(e) => playAudio(e, item.audio_url)}
                className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 transition-all shadow-sm shrink-0"
              >
                <Volume2 size={18} />
              </button>

              {/* Content Grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
                {/* Col 1: Word */}
                <div
                  className={`transition-all duration-500 ${
                    showWord
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 blur-sm select-none"
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {item.word}
                    </h4>
                    <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                      {item.ipa}
                    </span>
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                    {item.pos}
                  </span>
                </div>

                {/* Col 2: Meaning */}
                <div
                  className={`transition-all duration-500 ${
                    showMeaning
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2 blur-sm select-none"
                  }`}
                >
                  <p className="font-medium text-neutral-800 dark:text-neutral-200 leading-snug mb-1">
                    {item.meaning}
                  </p>
                  {item.example && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                      "{item.example}"
                    </p>
                  )}
                </div>
              </div>

              {/* Option Menu (Placeholder for future Edit/Delete) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-neutral-300 dark:text-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-400">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {words.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-700 mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
              Bộ từ vựng này chưa có từ nào.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabDeckDetails;
