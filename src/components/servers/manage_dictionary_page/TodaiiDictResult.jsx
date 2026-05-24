import { motion } from "framer-motion";
import { Volume2, Award } from "lucide-react";

const TodaiiDictResult = ({ data, onWordClick }) => {
    // Check cấu trúc response của Todaii
    if (!data || !data.result || data.result.length === 0) return null;

    return (
        <div className="space-y-8">
            {data.result.map((entry, idx) => (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={entry.id || idx}
                    className="bg-white dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-800"
                >
                    {/* Header Section */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {entry.word}
                            </h3>
                            <div className="flex items-center gap-3 text-lg font-mono text-gray-500 dark:text-gray-400">
                                {entry.pronounce?.base && <span>/{entry.pronounce.base}/</span>}
                            </div>
                        </div>

                        {/* Level Tags */}
                        {entry.levelWord && (
                            <div className="flex gap-2">
                                {entry.levelWord.toeic && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium">
                                        <Award className="w-4 h-4" />
                                        TOEIC {entry.levelWord.toeic}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pronunciation Audio (Anh/Mỹ) */}
                    {entry.pronounce && (entry.pronounce.us || entry.pronounce.gb) && (
                        <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                            {entry.pronounce.us && (
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                                    <Volume2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">US</span>
                                </button>
                            )}
                            {entry.pronounce.gb && (
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                                    <Volume2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">UK</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Main Content: Nghĩa và Ví dụ */}
                    <div className="space-y-8">
                        {entry.content?.map((contentBlock, cIdx) => (
                            <div key={cIdx}>
                                {contentBlock.kind && (
                                    <div className="flex items-center gap-4 mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                            {contentBlock.kind}
                                        </h4>
                                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                    </div>
                                )}

                                <ul className="space-y-6 pl-4">
                                    {contentBlock.means?.map((mean, mIdx) => (
                                        <li key={mIdx} className="relative">
                                            <span className="absolute -left-4 top-2 w-1.5 h-1.5 rounded-full bg-gray-400" />
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
                                                {mean.mean}
                                            </p>

                                            {/* Examples */}
                                            {mean.examples?.length > 0 && (
                                                <div className="space-y-2 bg-gray-50 dark:bg-gray-800 border-l-2 border-gray-300 dark:border-gray-600 rounded-r-lg p-3">
                                                    {mean.examples.map((ex, eIdx) => (
                                                        <div key={eIdx} className="mb-2 last:mb-0">
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                                {ex.e}
                                                            </p>
                                                            {ex.m && (
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                                                    {ex.m}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Footer: Synonyms & Antonyms */}
                    {entry.snym?.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {entry.snym.map((snymBlock, sIdx) => (
                                <div key={sIdx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        {snymBlock.kind}
                                    </h5>
                                    {snymBlock.content?.map((c, i) => (
                                        <div key={i} className="flex flex-wrap gap-2 mb-2 last:mb-0">
                                            {c.syno?.map((s, idx) => (
                                                <span
                                                    key={`syn-${idx}`}
                                                    onClick={() => onWordClick(s)}
                                                    className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                            {c.anto?.map((a, idx) => (
                                                <span
                                                    key={`ant-${idx}`}
                                                    onClick={() => onWordClick(a)}
                                                    className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                                                >
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default TodaiiDictResult;