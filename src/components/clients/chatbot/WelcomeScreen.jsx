import React from "react";
import { MessageSquareText, BookOpen, Languages, History } from "lucide-react";
import { motion } from "framer-motion";

const SUGGESTIONS = [
  {
    id: 2,
    icon: <BookOpen size={15} />,
    title: "Giải thích ngữ pháp",
  },
  {
    id: 3,
    icon: <Languages size={15} />,
    title: "Dịch văn bản",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, delay, ease: "easeOut" },
});

const WelcomeScreen = ({ onLoadHistory, isHistoryLoading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5 py-6 text-center">
      {/* Brand logo avatar instead of glow particles */}
      <motion.div {...fadeUp(0)} className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm select-none">
          T
        </div>
      </motion.div>

      <motion.h3
        {...fadeUp(0.05)}
        className="text-[16px] font-bold text-zinc-900 mb-1.5 tracking-tight"
      >
        Todaii Assistant
      </motion.h3>

      <motion.p
        {...fadeUp(0.09)}
        className="text-[12.5px] text-zinc-500 max-w-[240px] mb-5 leading-relaxed"
      >
        Trợ lý học tiếng Anh hiệu quả hơn.
      </motion.p>

      {/* History button - clean Messenger style */}
      <motion.button
        {...fadeUp(0.12)}
        onClick={onLoadHistory}
        disabled={isHistoryLoading}
        className="flex items-center gap-2 px-4 py-2 mb-8
          bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11.5px] font-bold
          rounded-full border border-zinc-200/50
          active:scale-95 disabled:opacity-50 transition-all duration-150"
      >
        <History size={13} className={isHistoryLoading ? "animate-spin" : ""} />
        <span>
          {isHistoryLoading ? "Đang tải..." : "Xem lịch sử trò chuyện"}
        </span>
      </motion.button>

      {/* Quick suggestions */}
      <motion.div {...fadeUp(0.16)} className="w-full space-y-2">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
          Gợi ý câu hỏi
        </p>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.id}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left
              rounded-xl border border-zinc-200/60 bg-white
              hover:border-zinc-350 hover:bg-zinc-50/50 hover:shadow-sm
              transition-all duration-150 group"
          >
            <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-zinc-100 text-zinc-500 transition-colors">
              {s.icon}
            </span>
            <span className="text-[13px] font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors">
              {s.title}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
