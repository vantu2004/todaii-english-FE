import React from "react";
import { Sparkles, Bot } from "lucide-react";

const ProviderSwitcher = ({ provider, setProvider }) => {
  return (
    <div className="flex items-center bg-zinc-100/90 rounded-lg p-0.5 border border-zinc-200/40 mr-1 select-none">
      <button
        onClick={() => setProvider("OPENAI")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all duration-200
          ${
            provider === "OPENAI"
              ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/20"
              : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30"
          }`}
        aria-label="Dùng GPT"
      >
        <Sparkles
          size={10}
          className={
            provider === "OPENAI" ? "text-amber-500 fill-amber-500" : ""
          }
        />
        <span>GPT</span>
      </button>

      <button
        onClick={() => setProvider("GEMINI")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all duration-200
          ${
            provider === "GEMINI"
              ? "bg-white text-zinc-900 shadow-sm border border-zinc-200/20"
              : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/30"
          }`}
        aria-label="Dùng Gemini"
      >
        <Bot
          size={10}
          className={
            provider === "GEMINI" ? "text-emerald-600 fill-emerald-600/30" : ""
          }
        />
        <span>Gemini</span>
      </button>
    </div>
  );
};

export default ProviderSwitcher;
