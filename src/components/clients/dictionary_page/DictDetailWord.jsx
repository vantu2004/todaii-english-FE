// src/components/dictionary/DictDetailWord.jsx
import React from "react";
import { Volume2, Bookmark, Share2 } from "lucide-react";
import HighlightText from "./HighLightText";

const DictDetailWord = ({ data }) => {
  if (!data) return null;

  const { headword, ipa, audio_url, senses } = data;

  const playAudio = () => {
    if (audio_url) {
      new Audio(audio_url).play();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm min-h-[500px]">
      {/* Header: Word & Phonetic */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            {headword}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg text-neutral-500 bg-neutral-50 px-2 py-1 rounded">
              {ipa}
            </span>
            {audio_url && (
              <button
                onClick={playAudio}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-transform active:scale-95 shadow-md"
              >
                <Volume2 size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-2 text-neutral-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors">
            <Bookmark size={20} />
          </button>
          <button className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Senses List */}
      <div className="space-y-8">
        {senses?.map((sense) => (
          <div
            key={sense.id}
            className="relative pl-4 border-l-4 border-purple-200"
          >
            {/* POS & Meaning */}
            <div className="mb-2">
              <span className="inline-block px-2 py-0.5 bg-neutral-900 text-white text-xs font-bold uppercase rounded mr-2 align-middle">
                {sense.pos}
              </span>
              <span className="text-xl font-bold text-purple-700">
                {sense.meaning}
              </span>
            </div>

            {/* English Definition */}
            <p className="text-sm text-neutral-500 italic mb-3">
              — {sense.definition}
            </p>

            {/* Example */}
            {sense.example && (
              <div className="bg-neutral-50 p-3 rounded-xl text-neutral-700 text-sm">
                <span className="font-bold text-neutral-400 text-xs uppercase block mb-1">
                  Ví dụ:
                </span>
                <HighlightText text={sense.example} keyword={headword} />
              </div>
            )}

            {/* Synonyms/Collocations */}
            {(sense.synonyms?.length > 0 || sense.collocations?.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sense.synonyms?.map((syn, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100"
                  >
                    ≈ {syn}
                  </span>
                ))}
                {sense.collocations?.map((col, i) => (
                  <span
                    key={i}
                    className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-100"
                  >
                    + {col}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DictDetailWord;
