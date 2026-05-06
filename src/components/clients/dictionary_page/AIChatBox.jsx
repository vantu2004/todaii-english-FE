import { useState, useRef, useEffect } from "react";
import { Bot, Send, Trash2, User, AlertCircle, Sparkles } from "lucide-react";
import { askGemini } from "../../../api/clients/dictionaryApi";

const AIChatBox = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      content:
        "Xin chào! Tôi là trợ lý AI. Bạn cần giải thích từ vựng hay đặt câu ví dụ nào không?",
      timestamp: Date.now(),
    },
  ]);

  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  const MAX_HISTORY = 50;
  const MAX_CHAR_LIMIT = 1024;

  // Fix Auto Scroll: Chỉ cuộn container nội bộ
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        content: "Đã xóa lịch sử trò chuyện.",
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    const question = input.trim();

    if (!question) return;
    if (question.length > MAX_CHAR_LIMIT) {
      alert(`Câu hỏi quá dài (${question.length}/${MAX_CHAR_LIMIT} ký tự).`);
      return;
    }

    const userMsg = {
      id: Date.now(),
      sender: "user",
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const newHistory = [...prev, userMsg];
      return newHistory.length > MAX_HISTORY
        ? newHistory.slice(newHistory.length - MAX_HISTORY)
        : newHistory;
    });

    setInput("");
    setIsLoading(true);

    try {
      const responseText = await askGemini(question);

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Empty response");
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        content: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const newHistory = [...prev, botMsg];
        return newHistory.length > MAX_HISTORY
          ? newHistory.slice(newHistory.length - MAX_HISTORY)
          : newHistory;
      });
    } catch (error) {
      console.error("AI Chat Error:", error);

      const errorMsg = {
        id: Date.now() + 1,
        sender: "bot",
        isError: true,
        content:
          "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) handleSendMessage();
    }
  };

  return (
    <div
      className={
        "bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col h-[500px] sticky top-24 overflow-hidden"
      }
    >
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
          <div className="p-1.5 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white shadow-sm">
            <Sparkles
              size={16}
              fill="currentColor"
              className="text-neutral-900 dark:text-white"
            />
          </div>
          <h3 className="font-bold text-sm uppercase tracking-wide">
            Trợ lý AI
          </h3>
        </div>
        <button
          onClick={handleClearChat}
          className="text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors p-1.5 rounded-md hover:bg-red-50"
          title="Xóa lịch sử chat"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* MESSAGES LIST */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-transparent custom-scrollbar scroll-smooth"
      >
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                isBot ? "items-start" : "items-end flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border 
                ${
                  isBot
                    ? msg.isError
                      ? "bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800 text-red-500"
                      : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 shadow-sm"
                    : "bg-neutral-900 border-neutral-900 text-white"
                }`}
              >
                {isBot ? (
                  msg.isError ? (
                    <AlertCircle size={16} />
                  ) : (
                    <Bot size={16} />
                  )
                ) : (
                  <User size={16} />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] p-3.5 text-sm leading-relaxed rounded-2xl shadow-sm whitespace-pre-wrap break-words
                ${
                  isBot
                    ? "bg-neutral-50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-100 dark:border-neutral-700"
                    : "bg-neutral-900 text-white rounded-tr-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot size={16} />
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-2xl rounded-tl-none border border-neutral-100 dark:border-neutral-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-transparent">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "Đang trả lời..." : "Hỏi gì đó..."}
            className="w-full pl-4 pr-12 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:ring-4 focus:ring-neutral-100 dark:focus:ring-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:shadow-md active:scale-95 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-600 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-center text-neutral-400 dark:text-neutral-500 mt-2">
          AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.
        </p>
      </div>
    </div>
  );
};

export default AIChatBox;
