// src/components/dictionary/RawDetailWord.jsx
import { Volume2, Sparkles } from "lucide-react";
import { playAudio } from "../../../utils/playAudio";

const RawDetailWord = ({ data, onRequestAI, showAIButton }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-8">
      {data.map((wordData, idx) => {
        // Tìm audio đầu tiên có giá trị
        const audioSrc = wordData.phonetics?.find((p) => p.audio)?.audio;

        return (
          <div
            key={idx}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm"
          >
            {/* Alert Header */}
            {showAIButton && (
              <div className="bg-amber-50 text-amber-800 px-4 py-3 rounded-xl mb-6 text-sm flex items-center justify-between">
                <span>
                  Từ này chưa có trong từ điển chi tiết (Anh-Việt). Đang hiển
                  thị dữ liệu thô (Anh-Anh).
                </span>
                <button
                  onClick={() => onRequestAI(wordData.word)}
                  className="flex items-center gap-1 bg-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-300 transition-colors"
                >
                  <Sparkles size={14} /> Dùng AI Dịch
                </button>
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                  {wordData.word}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg text-neutral-500 bg-neutral-50 px-2 py-1 rounded">
                    {wordData.phonetic}
                  </span>
                  {audioSrc && (
                    <button
                      onClick={() => playAudio(audioSrc)}
                      className="p-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-700 transition-transform active:scale-95"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Meanings */}
            <div className="space-y-6">
              {wordData.meanings?.map((meaning, mIdx) => (
                <div key={mIdx}>
                  <h3 className="font-bold text-lg italic text-neutral-500 mb-2 border-b border-neutral-100 pb-1">
                    {meaning.partOfSpeech}
                  </h3>
                  <ul className="space-y-3 list-disc pl-5 text-neutral-700">
                    {meaning.definitions?.slice(0, 3).map((def, dIdx) => (
                      <li key={dIdx} className="text-sm leading-relaxed">
                        <span className="font-medium">{def.definition}</span>
                        {def.example && (
                          <p className="text-neutral-500 text-xs mt-1">
                            "{def.example}"
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RawDetailWord;
