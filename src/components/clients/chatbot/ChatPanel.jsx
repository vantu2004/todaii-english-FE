import React from "react";
import { motion } from "framer-motion";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChatbot } from "@/hooks/clients/useChatbot";

const ChatPanel = ({ onClose, isMobile }) => {
  const {
    messages,
    isLoading,
    isStreaming,
    aiProvider,
    setAiProvider,
    sendMessage,
    clearMessages,
    loadHistory,
    isHistoryLoading,
    hasMoreHistory,
  } = useChatbot();

  const desktopVariants = {
    initial: { opacity: 0, scale: 0.93, y: 16 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.93,
      y: 16,
      transition: { duration: 0.16, ease: "easeIn" },
    },
  };

  const mobileVariants = {
    initial: { y: "100%" },
    animate: { y: 0, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } },
    exit: { y: "100%", transition: { duration: 0.25, ease: "easeIn" } },
  };

  const variants = isMobile ? mobileVariants : desktopVariants;

  const containerClass = isMobile
    ? "fixed inset-0 w-full h-[100dvh] pb-[env(safe-area-inset-bottom)] bg-white z-[70] flex flex-col"
    : [
        "fixed bottom-[88px] right-6",
        "w-[400px] h-[600px] max-h-[min(78vh,660px)]",
        "bg-white z-[70] flex flex-col",
        "rounded-2xl overflow-hidden",
        "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),0_8px_24px_-8px_rgba(0,0,0,0.08)]",
        "border border-zinc-200",
      ].join(" ");

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={containerClass}
      role="dialog"
      aria-label="Todaii AI Chat"
    >
      <ChatHeader
        onClose={onClose}
        onClear={clearMessages}
        aiProvider={aiProvider}
        setAiProvider={setAiProvider}
        isMobile={isMobile}
        onLoadHistory={loadHistory}
        isHistoryLoading={isHistoryLoading}
        hasMoreHistory={hasMoreHistory}
      />

      <MessageList
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onLoadHistory={loadHistory}
        isHistoryLoading={isHistoryLoading}
        hasMoreHistory={hasMoreHistory}
      />

      <ChatInput onSend={sendMessage} isLoading={isLoading || isStreaming} />
    </motion.div>
  );
};

export default ChatPanel;
