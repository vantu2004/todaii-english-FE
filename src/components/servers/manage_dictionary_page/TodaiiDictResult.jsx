import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { loadVoices, handleSpeak } from "@/utils/ReactSpeechKit";
import { useEffect, useMemo } from "react";

const TodaiiDictResult = ({ data, onWordClick }) => {
  useEffect(() => {
    loadVoices();

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  if (!data || !data.result || data.result.length === 0) {
    return null;
  }

  const mainResults = useMemo(() => {
    return data.result.slice(0, data.result.length);
  }, [data.result]);

  return (
    <div className="space-y-6">
      {mainResults.map((entry, idx) => (
        <motion.div
          key={entry.id || idx}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 mb-5"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {entry.word}
              </h2>

              <div className="mt-2 space-y-1 text-sm font-mono text-gray-500 dark:text-gray-400">
                {entry.pronounce?.us && <p>US: /{entry.pronounce.us}/</p>}

                {entry.pronounce?.gb && <p>UK: /{entry.pronounce.gb}/</p>}
              </div>

              {entry.level_word?.toeic && (
                <div className="mt-4 inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  TOEIC {entry.level_word.toeic}
                </div>
              )}
            </div>

            {/* AUDIO */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSpeak(entry.word, "")}
                className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Volume2 className="w-4 h-4" />

                <span className="text-xs font-medium">Speak</span>
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-8 space-y-8">
            {entry.content?.map((contentBlock, cIdx) => (
              <div key={cIdx}>
                {(contentBlock.kind || contentBlock.field) && (
                  <h3 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {contentBlock.kind}

                    {contentBlock.field && ` • ${contentBlock.field} `}
                  </h3>
                )}

                <div className="space-y-6">
                  {contentBlock.means?.map((mean, mIdx) => (
                    <div
                      key={mIdx}
                      className="border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                    >
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {mean.mean}
                      </p>

                      {/* EXAMPLES */}
                      {mean.examples?.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {mean.examples.map((ex, eIdx) => (
                            <div
                              key={eIdx}
                              className="rounded-lg bg-gray-50 dark:bg-gray-800/60 p-4 border border-gray-100 dark:border-gray-700"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <p className="italic text-gray-700 dark:text-gray-300">
                                  {ex.e}
                                </p>

                                <button
                                  onClick={() => handleSpeak(ex.e, "")}
                                  className="shrink-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>

                              {ex.m && (
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                  {ex.m}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* WORD FAMILY */}
          {entry.word_family?.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                Word Family
              </h3>

              <div className="flex flex-wrap gap-2">
                {entry.word_family.map((wf, wfIdx) =>
                  wf.content?.map((word, wIdx) => (
                    <button
                      key={`${wfIdx} -${wIdx} `}
                      onClick={() => onWordClick?.(word)}
                      className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm transition"
                    >
                      {word}
                    </button>
                  )),
                )}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TodaiiDictResult;
