import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

const FreeDictResult = ({ data, onWordClick }) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    return (
        <div className="space-y-8">
            {data.map((entry, idx) => (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx}
                    className="bg-white dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-800"
                >
                    {/* Header */}
                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {entry.word}
                        </h3>
                        {entry.phonetic && (
                            <p className="text-lg text-gray-500 dark:text-gray-400 font-mono">
                                {entry.phonetic}
                            </p>
                        )}
                    </div>

                    {/* Audio */}
                    {entry.phonetics && entry.phonetics.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-8">
                            {entry.phonetics.map((p, i) => p.audio && (
                                <button
                                    key={i}
                                    onClick={() => new Audio(p.audio).play()}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Volume2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">{p.text || "Audio"}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Meanings */}
                    {entry.meanings?.map((meaning, mIdx) => (
                        <div key={mIdx} className="mb-8 last:mb-0">
                            <div className="flex items-center gap-4 mb-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                    {meaning.partOfSpeech}
                                </h4>
                                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            </div>

                            <ul className="space-y-4 pl-4">
                                {meaning.definitions?.map((def, dIdx) => (
                                    <li key={dIdx} className="relative">
                                        <span className="absolute -left-4 top-2 w-1.5 h-1.5 rounded-full bg-gray-400" />
                                        <p className="text-gray-700 dark:text-gray-300">{def.definition}</p>

                                        {def.example && (
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 border-l-2 border-gray-300 dark:border-gray-600 pl-3 py-1">
                                                "{def.example}"
                                            </p>
                                        )}

                                        {def.synonyms?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Synonyms:</span>
                                                {def.synonyms.map((syn, sIdx) => (
                                                    <span
                                                        key={sIdx}
                                                        onClick={() => onWordClick(syn)}
                                                        className="cursor-pointer text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md px-2 py-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    >
                                                        {syn}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </motion.div>
            ))}
        </div>
    );
};

export default FreeDictResult;