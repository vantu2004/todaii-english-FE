import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  BookOpen,
  Layers,
  Link as LinkIcon,
  Shuffle,
  AlertCircle,
  Languages,
  BookA,
} from "lucide-react";
import SearchBar from "@/components/clients/SearchBar";
import { getWordByTodaiiApi } from "@/api/clients/todaiiDictionaryApi";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/* --- Reusable UI Components --- */
const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2 text-text-tertiary">
      {Icon && <Icon size={14} className="opacity-70" />}
      <h2 className="text-xs font-semibold uppercase tracking-widest">
        {title}
      </h2>
    </div>
    <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700/50 ml-4" />
  </div>
);

const TagBadge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center bg-neutral-100 dark:bg-neutral-800 text-text-secondary rounded-lg px-2.5 py-1 text-xs font-medium font-inter hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors ${className}`}
  >
    {children}
  </span>
);

const PronounceButton = ({ region, text }) => {
  if (!text) return null;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
        {region}
      </span>
      <span className="text-base font-inter text-text-primary tracking-wide">
        /{text}/
      </span>
      <button
        type="button"
        aria-label={`Listen to ${region} pronunciation`}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-neutral-100/60 dark:bg-neutral-800/60 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 text-brand-500 transition-all duration-200 hover:scale-[1.05]"
      >
        <Volume2 size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};

/* --- Main Sections --- */
const WordHeader = ({ word, levelWord, pronounce }) => (
  <motion.div variants={slideUp} className="mb-10 sm:mb-12">
    {/* Levels */}
    {(levelWord?.toeic || levelWord?.vietnam) && (
      <div className="flex flex-wrap gap-2 mb-4">
        {levelWord.toeic && (
          <TagBadge className="text-accent-500 bg-accent-500/10 dark:bg-accent-500/10">
            TOEIC {levelWord.toeic}
          </TagBadge>
        )}
        {levelWord.vietnam && <TagBadge>Level {levelWord.vietnam}</TagBadge>}
      </div>
    )}

    {/* Word */}
    <h1
      className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-6"
      style={{ fontFamily: "var(--font-jarkata-sans)" }}
    >
      {word}
    </h1>

    {/* Pronunciation */}
    {pronounce && (
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
        <PronounceButton region="UK" text={pronounce.gb} />
        <PronounceButton region="US" text={pronounce.us} />
      </div>
    )}
  </motion.div>
);

const MeaningSection = ({ content }) => {
  if (!content || content.length === 0) return null;

  return (
    <div className="mb-12">
      <SectionHeader title="Định nghĩa & Ví dụ" icon={BookOpen} />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-6"
      >
        {content.map((item, idx) => (
          <motion.div
            key={idx}
            variants={slideUp}
            className="bg-white dark:bg-neutral-800/40 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow duration-300"
          >
            {/* Kind of word */}
            <h3 className="text-base font-semibold text-brand-500 mb-4 capitalize font-inter">
              {item.kind}
            </h3>

            <div className="space-y-6">
              {item.means?.map((mean, mIdx) => (
                <div key={mIdx} className="group">
                  {/* Meaning */}
                  <p className="text-base sm:text-lg text-text-primary font-medium leading-snug mb-3">
                    <span className="text-neutral-400 mr-2 font-inter">
                      {mIdx + 1}.
                    </span>
                    {mean.mean}
                  </p>

                  {/* Examples */}
                  {mean.examples && mean.examples.length > 0 && (
                    <div className="space-y-3 mt-3">
                      {mean.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="relative pl-4 ml-2 border-l-[3px] border-neutral-200 dark:border-neutral-700 group-hover:border-brand-500/40 transition-colors duration-300"
                        >
                          <p className="text-sm sm:text-base text-text-primary leading-relaxed">
                            {ex.e}
                          </p>
                          {ex.m && (
                            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const WordFamilyAndConjugation = ({ wordFamily, conjugation }) => {
  if (!wordFamily?.length && !conjugation) return null;

  return (
    <div className="mb-12">
      <SectionHeader title="Word Family & Conjugation" icon={Layers} />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
      >
        {/* Word Family Card */}
        {wordFamily && wordFamily.length > 0 && (
          <motion.div
            variants={slideUp}
            className="bg-surface-secondary dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 p-5"
          >
            <h3 className="text-sm font-semibold mb-4 text-text-primary">
              Họ từ vựng
            </h3>
            <div className="flex flex-wrap gap-2">
              {wordFamily.map((fam, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 w-full mb-3 last:mb-0"
                >
                  <span className="text-xs text-text-tertiary capitalize">
                    {fam.kind || fam.field}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {fam.content?.map((word, wIdx) => (
                      <TagBadge
                        key={wIdx}
                        className="bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100/50 dark:border-neutral-700/50"
                      >
                        {word}
                      </TagBadge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Conjugation Card */}
        {conjugation && Object.keys(conjugation).length > 0 && (
          <motion.div
            variants={slideUp}
            className="bg-surface-secondary dark:bg-neutral-800/30 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 p-5"
          >
            <h3 className="text-sm font-semibold mb-4 text-text-primary">
              Chia động từ
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(conjugation).map(([key, item]) => (
                <div
                  key={key}
                  className="bg-white dark:bg-neutral-800 p-3 rounded-xl shadow-sm border border-neutral-100/50 dark:border-neutral-700/50"
                >
                  <span className="text-[10px] uppercase font-bold tracking-widest text-text-tertiary block mb-1">
                    {key}
                  </span>
                  <span className="text-sm font-medium text-text-primary block">
                    {item.w}
                  </span>
                  {item.p && (
                    <span className="text-xs text-text-secondary font-inter block mt-0.5">
                      /{item.p}/
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const CollocationsAndSynonyms = ({ coll, snym }) => {
  if (!coll?.length && !snym?.length) return null;

  return (
    <div className="mb-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Collocations */}
        {coll && coll.length > 0 && (
          <motion.div variants={slideUp}>
            <SectionHeader
              title="Cụm từ đi kèm (Collocations)"
              icon={LinkIcon}
            />
            <div className="space-y-4">
              {coll.slice(0, 3).map((c, idx) => (
                <div
                  key={idx}
                  className="bg-surface-secondary dark:bg-neutral-800/30 rounded-xl p-4 border border-neutral-100 dark:border-neutral-700/50"
                >
                  {c.cls?.map((clItem, clIdx) => (
                    <div key={clIdx} className="mb-3 last:mb-0">
                      <p className="text-sm font-semibold text-text-primary mb-2">
                        {clItem.mean}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {clItem.cl?.flatMap((typeItem) =>
                          typeItem.cbs?.map((cbItem, cbIdx) => (
                            <TagBadge
                              key={`${clIdx}-${cbIdx}`}
                              className="bg-white dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50"
                            >
                              {cbItem.cb}
                            </TagBadge>
                          )),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Synonyms & Antonyms */}
        {snym && snym.length > 0 && (
          <motion.div variants={slideUp}>
            <SectionHeader title="Đồng nghĩa / Trái nghĩa" icon={Shuffle} />
            <div className="space-y-4">
              {snym.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-surface-secondary dark:bg-neutral-800/30 rounded-xl p-4 border border-neutral-100 dark:border-neutral-700/50"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-500 block mb-3">
                    {s.kind}
                  </span>
                  {s.content?.map((cItem, cIdx) => (
                    <div key={cIdx} className="space-y-3">
                      {cItem.syno && cItem.syno.length > 0 && (
                        <div>
                          <span className="text-xs text-text-tertiary block mb-1">
                            Đồng nghĩa:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {cItem.syno.map((word, wIdx) => (
                              <TagBadge key={wIdx}>{word}</TagBadge>
                            ))}
                          </div>
                        </div>
                      )}
                      {cItem.anto && cItem.anto.length > 0 && (
                        <div>
                          <span className="text-xs text-text-tertiary block mb-1">
                            Trái nghĩa:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {cItem.anto.map((word, wIdx) => (
                              <TagBadge
                                key={wIdx}
                                className="text-accent-500 bg-accent-500/10 dark:bg-accent-500/10"
                              >
                                {word}
                              </TagBadge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

/* --- States --- */
const SkeletonLoader = () => (
  <div className="animate-pulse w-full mt-8">
    <div className="mb-10">
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
        <div className="h-6 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
      </div>
      <div className="h-14 w-64 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mb-6" />
      <div className="flex gap-4">
        <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
        <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
      </div>
    </div>
    <div className="space-y-6">
      <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-6" />
      <div className="h-32 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl w-full" />
      <div className="h-40 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl w-full" />
    </div>
  </div>
);

const EmptyState = ({ isInitial }) => (
  <motion.div
    variants={fadeIn}
    initial="hidden"
    animate="show"
    className="flex flex-col items-center justify-center py-20 text-center px-4"
  >
    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-5 text-neutral-400">
      <AlertCircle size={28} strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-semibold text-text-primary mb-2">
      {isInitial ? "Tra cứu từ vựng" : "Không tìm thấy từ vựng"}
    </h3>
    <p className="text-sm text-text-secondary max-w-sm">
      {isInitial
        ? "Hãy nhập từ bạn muốn tra cứu vào thanh tìm kiếm phía trên."
        : "Từ vựng này có thể không tồn tại trong hệ thống hoặc đã xảy ra lỗi. Vui lòng thử lại."}
    </p>
  </motion.div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TodaiiDictionary = () => {
  // State quản lý Component
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState("en-vi");
  const [wordData, setWordData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);

  // Xử lý fetch dữ liệu
  const fetchWordData = async (word) => {
    if (!word.trim()) return;

    setIsLoading(true);
    setIsInitial(false);

    try {
      const responseData = await getWordByTodaiiApi(word, 1, 10);

      setWordData(responseData.result[0]);
    } catch (error) {
      console.error("Failed to fetch dictionary data", error);
      setWordData(null); // Set null để tự trigger màn hình EmptyState
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchWordData(term);
  };

  // Optional: Load một từ mặc định ban đầu nếu muốn
  useEffect(() => {
    // Nếu muốn tự động tải một từ, bạn có thể gọi: fetchWordData("hello");
  }, []);

  // Bóc tách biến để chuẩn bị render (chỉ bóc tách khi wordData không phải null/undefined)
  const {
    word,
    pronounce,
    levelWord,
    content,
    wordFamily,
    conjugation,
    coll,
    snym,
  } = wordData || {};

  return (
    <div className="flex-1 flex flex-col bg-surface-primary dark:bg-neutral-950 pt-24 pb-12 px-4 max-w-7xl mx-auto  sm:px-6 lg:px-8 w-full ">
      {/* --- SEARCH SECTION --- */}
      <div className="max-w-7xl mx-auto w-full mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          {/* Search Bar */}
          <div className="flex-1 relative z-10">
            <SearchBar
              value={searchTerm}
              placeholder={
                searchMode === "en-vi"
                  ? "Nhập từ vựng tiếng Anh..."
                  : "Type a word to define..."
              }
              onSearch={handleSearch}
            />
          </div>

          {/* Mode Switcher */}
          <div className="flex-shrink-0">
            <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center h-full">
              <button
                onClick={() => setSearchMode("en-vi")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  searchMode === "en-vi"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Languages size={16} />
                <span className="hidden sm:inline">Anh - Việt</span>
                <span className="sm:hidden">En-Vi</span>
              </button>

              <button
                onClick={() => setSearchMode("en-en")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  searchMode === "en-en"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <BookA size={16} />
                <span className="hidden sm:inline">Anh - Anh</span>
                <span className="sm:hidden">En-En</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      {isLoading ? (
        <SkeletonLoader />
      ) : !wordData || Object.keys(wordData).length === 0 ? (
        <EmptyState isInitial={isInitial} />
      ) : (
        <AnimatePresence mode="wait">
          <motion.article
            key={wordData.id || word}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            {/* Vibe: Editorial Calm - Nội dung là trọng tâm, spacing thoáng */}
            <WordHeader
              word={word}
              levelWord={levelWord}
              pronounce={pronounce}
            />

            <MeaningSection content={content} />

            <WordFamilyAndConjugation
              wordFamily={wordFamily}
              conjugation={conjugation}
            />

            <CollocationsAndSynonyms coll={coll} snym={snym} />
          </motion.article>
        </AnimatePresence>
      )}
    </div>
  );
};

export default TodaiiDictionary;
