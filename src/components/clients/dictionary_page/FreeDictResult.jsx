import { motion } from "framer-motion";
import { Volume2, Plus } from "lucide-react";
import { useEffect } from "react";
import { loadVoices, handleSpeak } from "@/utils/ReactSpeechKit";

const FreeDictResult = ({ data, onWordClick, onSaveToNotebook }) => {
  useEffect(() => {
    loadVoices();

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  return (
    <div className="space-y-6">
      {data.map((entry, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800/80 p-6 sm:p-8 mb-5 shadow-sm"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {entry.word}
              </h2>

              {entry.phonetic && (
                <p className="mt-2 text-sm font-mono text-neutral-500 dark:text-neutral-400">
                  {entry.phonetic}
                </p>
              )}
            </div>

            {/* AUDIO & SAVE */}
            <div className="flex flex-wrap gap-2 items-center">
              {onSaveToNotebook && (
                <button
                  onClick={() => onSaveToNotebook(entry.word, null)}
                  className="flex items-center gap-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-150 dark:border-neutral-700 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-brand-500 transition text-neutral-750 dark:text-neutral-300 shadow-sm active:scale-95 animate-in fade-in duration-200"
                >
                  <Plus className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-semibold">Lưu sổ tay</span>
                </button>
              )}
              {entry.phonetics?.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSpeak(entry.word, p.audio)}
                  className="flex items-center gap-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-150 dark:border-neutral-700 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-brand-500 transition"
                >
                  <Volume2 className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {p.audio ? p.text || "Audio" : "TTS"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* MEANINGS */}
          <div className="mt-8 space-y-8">
            {entry.meanings?.map((meaning, mIdx) => (
              <div key={mIdx}>
                <h3 className="text-sm font-bold text-brand-650 dark:text-brand-400 mb-4 capitalize tracking-wide">
                  {meaning.partOfSpeech}
                </h3>

                <ul className="space-y-6">
                  {meaning.definitions?.map((def, dIdx) => (
                    <li
                      key={dIdx}
                      className="pl-4 border-l-2 border-brand-200 dark:border-brand-800"
                    >
                      {/* DEFINITION */}
                      <p className="text-base text-neutral-800 dark:text-neutral-200">
                        {def.definition}
                      </p>

                      {/* EXAMPLE */}
                      {def.example && (
                        <div className="mt-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/30 p-4 border border-neutral-100 dark:border-neutral-800">
                          <p className="italic text-neutral-600 dark:text-neutral-400 text-sm">
                            "{def.example}"
                          </p>
                        </div>
                      )}

                      {/* SYNONYMS */}
                      {def.synonyms?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold self-center mr-1">
                            Synonyms:
                          </span>
                          {def.synonyms.map((syn, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => onWordClick(syn)}
                              className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition"
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* ANTONYMS */}
                      {def.antonyms?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold self-center mr-1">
                            Antonyms:
                          </span>
                          {def.antonyms.map((ant, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => onWordClick(ant)}
                              className="px-3 py-1 rounded-lg border border-neutral-205 dark:border-neutral-750 hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition"
                            >
                              {ant}
                            </button>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FreeDictResult;
