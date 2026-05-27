import React from "react";
import { User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import MarkdownRenderer from "./MarkdownRenderer";

const MessageBubble = ({ message }) => {
  const isBot = message.role === "assistant";

  // Hide empty streaming placeholder — TypingIndicator handles the wait state
  if (isBot && message.isStreaming && !message.content) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`flex gap-2.5 ${isBot ? "items-start" : "items-end flex-row-reverse"}`}
    >
      {/* Avatar - brand letter "T" for Bot, User icon for User */}
      <div
        className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10.5px] font-bold shadow-sm border select-none
          ${
            isBot
              ? message.isError
                ? "bg-red-100 border-red-200 text-red-500"
                : "bg-zinc-900 border-zinc-900 text-white"
              : "bg-zinc-100 border-zinc-200 text-zinc-500"
          }`}
      >
        {isBot ? (
          message.isError ? (
            <AlertCircle size={13} className="text-red-500" />
          ) : (
            "T"
          )
        ) : (
          <User size={12} />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[82%] px-3.5 py-2.5 text-[13.5px] leading-relaxed rounded-2xl break-words
          ${
            isBot
              ? message.isError
                ? "bg-red-50 text-red-700 border border-red-100 rounded-tl-sm"
                : "bg-white text-zinc-800 border border-stone-200 rounded-tl-sm shadow-sm"
              : "bg-zinc-900 text-white rounded-tr-sm shadow-sm"
          }`}
      >
        <MarkdownRenderer content={message.content} isBot={isBot} />

        {/* Streaming cursor - emerald color */}
        {isBot && message.isStreaming && message.content && (
          <span className="inline-block w-[2px] h-3.5 bg-emerald-500 ml-0.5 align-middle animate-pulse rounded-sm" />
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
