import React, { useState, useEffect, useRef } from "react";
import { MessageCircleMore, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ChatPanel from "./ChatPanel";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative z-[60]" ref={chatbotRef}>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 22 },
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-[58px] h-[58px] rounded-2xl
              bg-zinc-600 text-white shadow-xl shadow-zinc-950/25
              flex items-center justify-center
              hover:scale-105 hover:bg-zinc-700 hover:shadow-2xl hover:shadow-zinc-950/30
              active:scale-95 transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-zinc-500/30"
            aria-label="Mở Todaii AI"
          >
            <MessageCircleMore size={26} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <ChatPanel onClose={() => setIsOpen(false)} isMobile={isMobile} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;
