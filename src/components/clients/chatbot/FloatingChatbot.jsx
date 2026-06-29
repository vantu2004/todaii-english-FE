import React, { useState, useEffect, useRef } from "react";
import { CircleX, MessageCircleMore, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ChatPanel from "./ChatPanel";

const FloatingChatbot = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isFabHide, setIsFabHide] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chatbotRef = useRef(null);

  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (chatbotRef.current && !chatbotRef.current.contains(e.target)) {
        handleChatbotClose();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        handleChatbotClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleChatbotOpen = () => {
    setIsChatbotOpen(true);
    setIsFabHide(true);
  };

  const handleChatbotClose = () => {
    setIsChatbotOpen(false);
    setIsFabHide(false);
  };

  return (
    <div className="relative z-[60]" ref={chatbotRef}>
      {/* FAB */}
      <AnimatePresence>
        {!isFabHide && (
          <motion.div
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 22,
              },
            }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: { duration: 0.15 },
            }}
            className="fixed bottom-6 right-6"
          >
            {/* Nút đóng */}
            <button
              onClick={() => setIsFabHide(true)}
              className="absolute -top-2 -right-2 z-10"
              aria-label="Ẩn FAB"
            >
              <CircleX className="text-red-400 hover:text-red-600" size={20} />
            </button>

            {/* FAB */}
            <motion.button
              onClick={() => handleChatbotOpen()}
              className="
                w-[64px] h-[64px]
                flex items-center justify-center
                hover:scale-105
                active:scale-95
                transition-all duration-200
              "
              aria-label="Mở Todaii AI"
            >
              <img
                src="/chatbot.png"
                alt="Todaii AI"
                className="w-full h-full object-cover"
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatbotOpen && (
          <ChatPanel onClose={() => handleChatbotClose()} isMobile={isMobile} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;
