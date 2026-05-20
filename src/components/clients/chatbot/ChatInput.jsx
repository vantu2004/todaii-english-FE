import React, { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isLoading) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isLoading]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = !isLoading && input.trim().length > 0;

  return (
    <div className="flex-shrink-0 px-4 pt-3 pb-4 bg-white border-t border-slate-100">
      <div
        className={`relative flex items-end gap-2 bg-white border rounded-2xl px-3 py-2
          shadow-sm transition-all duration-200
          ${
            canSend || input.length > 0
              ? "border-zinc-400 shadow-zinc-150/50 ring-2 ring-zinc-100"
              : "border-slate-200 hover:border-slate-350"
          }`}
      >
        <TextareaAutosize
          ref={inputRef}
          minRows={1}
          maxRows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={
            isLoading ? "Đang trả lời..." : "Nhắn gì đó với Todaii..."
          }
          className="flex-1 resize-none bg-transparent border-none focus:ring-0 text-[13.5px] py-1 text-slate-800 placeholder:text-slate-400 disabled:opacity-50 outline-none leading-relaxed"
        />

        <button
          onClick={handleSubmit}
          disabled={!canSend}
          className={`mb-0.5 p-2 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150
            ${
              canSend
                ? "bg-zinc-900 text-white shadow-md shadow-zinc-950/15 hover:bg-zinc-800 active:scale-95"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          aria-label="Gửi tin nhắn"
        >
          <Send size={14} className={canSend ? "translate-x-px" : ""} />
        </button>
      </div>

      <p className="text-[10.5px] text-center text-slate-400 mt-2 select-none">
        AI có thể mắc lỗi · Nhấn{" "}
        <kbd className="text-[9px] font-mono bg-slate-100 px-1 rounded">
          Enter
        </kbd>{" "}
        để gửi
      </p>
    </div>
  );
};

export default ChatInput;
