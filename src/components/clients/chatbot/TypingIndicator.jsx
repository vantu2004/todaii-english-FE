import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const TypingIndicator = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.18 }}
          className="flex gap-2.5 items-start select-none"
        >
          {/* Bot avatar - letter "T" instead of gradient sparks */}
          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-900 text-white flex items-center justify-center flex-shrink-0 shadow-sm text-[10.5px] font-bold">
            T
          </div>

          {/* Dots bubble */}
          <div className="bg-white border border-stone-200 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-bounce [animation-delay:-0.24s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-bounce [animation-delay:-0.16s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-bounce [animation-delay:-0.8s]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TypingIndicator;
