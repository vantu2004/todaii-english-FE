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
          className="rounded-3xl bg-white dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800/80 p-6 sm:p-8 mb-5 shadow-sm"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {entry.word}
              </h2>

              <div className="mt-2 space-y-1 text-sm font-mono text-neutral-550 dark:text-neutral-400">
                {entry.pronounce?.us && <p>US: /{entry.pronounce.us}/</p>}
                {entry.pronounce?.gb && <p>UK: /{entry.pronounce.gb}/</p>}
              </div>

              {entry.level_word?.toeic && (
                <div className="mt-4 inline-flex items-center rounded-lg bg-neutral-100 dark:bg-neutral-800/80 px-3 py-1 text-xs font-bold text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700">
                  TOEIC {entry.level_word.toeic}
                </div>
              )}
            </div>

            {/* AUDIO */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSpeak(entry.word, "")}
                className="flex items-center gap-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-gray-200 border-neutral-150 dark:border-neutral-700 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-brand-500 transition"
              >
                <Volume2 className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Speak
                </span>
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="mt-8 space-y-8">
            {entry.content?.map((contentBlock, cIdx) => (
              <div key={cIdx}>
                {(contentBlock.kind || contentBlock.field) && (
                  <h3 className="mb-4 text-sm font-bold text-brand-650 dark:text-brand-400 capitalize tracking-wide">
                    {contentBlock.kind}
                    {contentBlock.field && ` • ${contentBlock.field}`}
                  </h3>
                )}

                <div className="space-y-6">
                  {contentBlock.means?.map((mean, mIdx) => (
                    <div
                      key={mIdx}
                      className="border-l-2 border-brand-200 dark:border-brand-850 pl-4"
                    >
                      <p className="text-base text-neutral-800 dark:text-neutral-200 font-medium">
                        {mean.mean}
                      </p>

                      {/* EXAMPLES */}
                      {mean.examples?.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {mean.examples.map((ex, eIdx) => (
                            <div
                              key={eIdx}
                              className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/30 p-4 border border-neutral-100 dark:border-neutral-800"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <p className="italic text-neutral-600 dark:text-neutral-400 text-sm">
                                  {ex.e}
                                </p>

                                <button
                                  onClick={() => handleSpeak(ex.e, "")}
                                  className="shrink-0 text-neutral-450 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>

                              {ex.m && (
                                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
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
              <h3 className="mb-4 text-sm font-bold text-neutral-500 dark:text-neutral-400">
                Từ liên quan (Word Family)
              </h3>

              <div className="flex flex-wrap gap-2">
                {entry.word_family.map((wf, wfIdx) =>
                  wf.content?.map((word, wIdx) => (
                    <button
                      key={`${wfIdx}-${wIdx}`}
                      onClick={() => onWordClick?.(word)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white text-xs font-semibold text-neutral-705 dark:text-neutral-300 transition-all"
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
