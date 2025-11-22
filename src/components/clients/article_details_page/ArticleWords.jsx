import React from "react";
import { Volume2, BookOpen } from "lucide-react";

const ArticleWords = ({ entries }) => {
  if (!entries?.length) return null;

  return (
    <div className="mt-12 pt-10 border-t border-neutral-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-neutral-100 rounded-lg">
          <BookOpen size={24} className="text-neutral-700" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">
          Từ vựng quan trọng
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header: Word & Audio */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  {entry.headword}
                </h3>
                {entry.ipa && (
                  <p className="text-neutral-500 text-sm font-mono mt-1">
                    {entry.ipa}
                  </p>
                )}
              </div>

              {entry.audio_url && (
                <button
                  onClick={() => new Audio(entry.audio_url).play()}
                  className="w-10 h-10 rounded-full bg-neutral-50 text-neutral-600 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all shadow-sm active:scale-95"
                  title="Nghe phát âm"
                >
                  <Volume2 size={20} />
                </button>
              )}
            </div>

            {/* Senses List */}
            <div className="space-y-4">
              {entry.senses?.map((sense) => (
                <div key={sense.id} className="relative pl-3">
                  {/* Decorative Line */}
                  <div className="absolute left-0 top-1.5 bottom-1 w-0.5 bg-neutral-200 rounded-full" />

                  <div className="text-sm leading-relaxed">
                    {/* POS Badge */}
                    <span className="inline-block mr-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {sense.pos}
                    </span>

                    {/* Meaning */}
                    <span className="font-medium text-neutral-800">
                      {sense.meaning}
                    </span>

                    {/* Definition */}
                    <p className="text-neutral-500 mt-1 text-xs">
                      {sense.definition}
                    </p>

                    {/* Example */}
                    {sense.example && (
                      <div className="mt-2 p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                        <p className="text-neutral-600 italic text-xs">
                          "{sense.example}"
                        </p>
                      </div>
                    )}
                  </div>
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
