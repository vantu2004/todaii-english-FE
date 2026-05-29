import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useEffect } from "react";
import { loadVoices, handleSpeak } from "@/utils/ReactSpeechKit";

const FreeDictResult = ({ data, onWordClick }) => {
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
          className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 mb-5"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {entry.word}
              </h2>

              {entry.phonetic && (
                <p className="mt-1 text-sm font-mono text-gray-500 dark:text-gray-400">
                  {entry.phonetic}
                </p>
              )}
            </div>

            {/* AUDIO */}
            <div className="flex gap-2">
              {entry.phonetics?.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSpeak(entry.word, p.audio)}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Volume2 className="w-4 h-4" />

                  <span className="text-xs font-medium">
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
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 capitalize">
                  {meaning.partOfSpeech}
                </h3>

                <ul className="space-y-6">
                  {meaning.definitions?.map((def, dIdx) => (
                    <li
                      key={dIdx}
                      className="pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                    >
                      {/* DEFINITION */}
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {def.definition}
                      </p>

                      {/* EXAMPLE */}
                      {def.example && (
                        <div className="mt-3 rounded-lg bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-100 dark:border-gray-700">
                          <p className="italic text-gray-700 dark:text-gray-300">
                            "{def.example}"
                          </p>
                        </div>
                      )}

                      {/* SYNONYMS */}
                      {def.synonyms?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {def.synonyms.map((syn, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => onWordClick(syn)}
                              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition"
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* ANTONYMS */}
                      {def.antonyms?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {def.antonyms.map((ant, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => onWordClick(ant)}
                              className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition"
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
