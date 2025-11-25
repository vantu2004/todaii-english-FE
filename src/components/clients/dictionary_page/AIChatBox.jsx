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
        "bg-white rounded-3xl border border-neutral-100 shadow-sm flex flex-col h-[500px] sticky top-24 overflow-hidden"
      }
    >
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-2 text-neutral-900">
          <div className="p-1.5 bg-white border border-neutral-100 rounded-lg text-neutral-900 shadow-sm">
            <Sparkles
              size={16}
              fill="currentColor"
              className="text-neutral-900"
            />
          </div>
          <h3 className="font-bold text-sm uppercase tracking-wide">
            Trợ lý AI
          </h3>
        </div>
        <button
          onClick={handleClearChat}
          className="text-neutral-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-50"
          title="Xóa lịch sử chat"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* MESSAGES LIST */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar scroll-smooth"
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
                      ? "bg-red-50 border-red-100 text-red-500"
                      : "bg-white border-neutral-200 text-neutral-700 shadow-sm"
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
                    ? "bg-neutral-50 text-neutral-800 rounded-tl-none border border-neutral-100"
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
            <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 text-neutral-400 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot size={16} />
            </div>
            <div className="bg-neutral-50 p-3 rounded-2xl rounded-tl-none border border-neutral-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-3 border-t border-neutral-100 bg-white">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "Đang trả lời..." : "Hỏi gì đó..."}
            className="w-full pl-4 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 hover:shadow-md active:scale-95 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-center text-neutral-400 mt-2">
          AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.
        </p>
      </div>
    </div>
  );
};

export default AIChatBox;
