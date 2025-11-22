import React from "react";
import { Volume2, BookOpen, Sparkles, Languages } from "lucide-react";

const ArticleWords = ({ entries }) => {
  if (!entries?.length) return null;

  // Hàm helper để chọn màu cho badge loại từ (POS) cho sinh động
  const getPosStyle = (pos) => {
    const p = pos?.toLowerCase() || "";

    if (p.includes("noun") || p.includes("n."))
      return "bg-blue-50 text-blue-700 border-blue-100";

    if (p.includes("verb") || p.includes("v."))
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    if (p.includes("adjective") || p.includes("adj"))
      return "bg-purple-50 text-purple-700 border-purple-100";

    if (p.includes("adverb") || p.includes("adv"))
      return "bg-amber-50 text-amber-700 border-amber-100";

    if (p.includes("pronoun") || p.includes("pro"))
      return "bg-pink-50 text-pink-700 border-pink-100";

    if (p.includes("determiner") || p.includes("det"))
      return "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100";

    if (p.includes("preposition") || p.includes("prep"))
      return "bg-cyan-50 text-cyan-700 border-cyan-100";

    if (p.includes("conjunction") || p.includes("conj"))
      return "bg-lime-50 text-lime-700 border-lime-100";

    if (p.includes("interjection") || p.includes("interj"))
      return "bg-rose-50 text-rose-700 border-rose-100";

    if (p.includes("phrase")) return "bg-gray-50 text-gray-700 border-gray-100";

    // Default
    return "bg-indigo-50 text-indigo-700 border-indigo-100";
  };

  return (
    <div className="mt-8 pt-6 border-t border-dashed border-indigo-100">
      {/* Colorful Header */}
      <div className="flex items-center gap-2 mb-5 dark:text-gray-900">
        <div className="p-1.5 bg-gray-100 rounded-lg ">
          <Languages size={18} />
        </div>
        <h2 className="text-lg font-bold">Từ vựng quan trọng</h2>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group flex flex-col sm:flex-row gap-2 sm:gap-6 py-3 px-3 rounded-xl hover:bg-slate-100 transition-colors duration-200 border border-transparent hover:border-slate-100"
          >
            {/* LEFT: Word Identity */}
            <div className="sm:w-40 flex-shrink-0 pt-0.5">
              <div className="flex items-center gap-2">
                {/* Headword màu Indigo đậm đà hơn */}
                <span className="font-bold text-lg text-indigo-700 group-hover:text-indigo-600 transition-colors">
                  {entry.headword}
                </span>

                {entry.audio_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      new Audio(entry.audio_url).play();
                    }}
                    className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Volume2 size={12} />
                  </button>
                )}
              </div>

              {entry.ipa && (
                <span className="text-xs text-slate-500 font-mono block mt-0.5 ml-0.5">
                  {entry.ipa}
                </span>
              )}
            </div>

            {/* RIGHT: Senses */}
            <div className="flex-1 space-y-3">
              {entry.senses?.map((sense) => (
                <div key={sense.id} className="text-sm">
                  {/* Definition Line */}
                  <div className="leading-snug text-slate-800">
                    {/* POS Badge có màu sắc theo loại từ */}
                    <span
                      className={`
                        inline-block px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wide border
                        mr-2 align-middle ${getPosStyle(sense.pos)}
                      `}
                    >
                      {sense.pos}
                    </span>

                    <span className="font-bold text-slate-900 mr-1.5">
                      {sense.meaning}
                    </span>
                    <span className="text-slate-500 font-normal">
                      — {sense.definition}
                    </span>
                  </div>

                  {/* Example Line - Thêm màu cho đường kẻ */}
                  {sense.example && (
                    <div className="mt-1.5 ml-1 pl-3 border-l-2 border-indigo-200 text-xs text-slate-600 italic">
                      "{sense.example}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleWords;
