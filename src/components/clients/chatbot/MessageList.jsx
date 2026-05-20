import React, { useRef, useEffect, useState, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import WelcomeScreen from "./WelcomeScreen";
import { ChevronDown } from "lucide-react";

const MessageList = ({
  messages,
  isLoading,
  isStreaming,
  onLoadHistory,
  isHistoryLoading,
  hasMoreHistory,
}) => {
  const scrollRef = useRef(null);
  const topSentinelRef = useRef(null);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [initialScrolled, setInitialScrolled] = useState(false);

  // smoother streaming scroll
  const streamScrollFrame = useRef(null);

  // scroll anchoring refs
  const prevFirstMsgIdRef = useRef(null);
  const heightBeforeRef = useRef(0);
  const topBeforeRef = useRef(0);

  const scrollToBottom = (behavior = "smooth") => {
    const el = scrollRef.current;

    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior,
      });
    }
  };

  // cleanup animation frame
  useEffect(() => {
    return () => {
      if (streamScrollFrame.current) {
        cancelAnimationFrame(streamScrollFrame.current);
      }
    };
  }, []);

  // reset on clear
  useEffect(() => {
    if (messages.length === 0) {
      setInitialScrolled(false);
      setShowScrollBtn(false);
      prevFirstMsgIdRef.current = null;
    }
  }, [messages.length]);

  // smart scroll logic
  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const currentFirstId = messages[0]?.id ?? null;

    const didPrepend =
      messages.length > 0 &&
      prevFirstMsgIdRef.current !== null &&
      currentFirstId !== prevFirstMsgIdRef.current;

    if (didPrepend) {
      // restore position after prepend
      const diff = el.scrollHeight - heightBeforeRef.current;

      if (diff > 0) {
        el.scrollTop = topBeforeRef.current + diff;
      }
    } else if (messages.length > 0 && !initialScrolled) {
      scrollToBottom("auto");
      setInitialScrolled(true);
    } else {
      const lastMsg = messages[messages.length - 1];

      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 300;

      const shouldScroll =
        lastMsg?.role === "user" ||
        isLoading ||
        (isStreaming && isNearBottom) ||
        isNearBottom;

      if (shouldScroll) {
        if (isStreaming) {
          if (!streamScrollFrame.current) {
            streamScrollFrame.current = requestAnimationFrame(() => {
              scrollToBottom("auto");
              streamScrollFrame.current = null;
            });
          }
        } else {
          const t = setTimeout(() => {
            scrollToBottom("smooth");
          }, 40);

          return () => clearTimeout(t);
        }
      } else if (lastMsg?.role === "assistant" && !isStreaming) {
        setShowScrollBtn(true);
      }
    }

    prevFirstMsgIdRef.current = currentFirstId;
  }, [messages, isLoading, isStreaming, initialScrolled]);

  // auto load history
  const handleTopIntersect = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMoreHistory && !isHistoryLoading) {
        const el = scrollRef.current;

        if (el) {
          heightBeforeRef.current = el.scrollHeight;

          topBeforeRef.current = el.scrollTop;
        }

        onLoadHistory();
      }
    },
    [hasMoreHistory, isHistoryLoading, onLoadHistory],
  );

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    const container = scrollRef.current;

    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(handleTopIntersect, {
      root: container,
      threshold: 0.1,
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [handleTopIntersect]);

  const handleScroll = (e) => {
    const el = e.currentTarget;

    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 150;

    setShowScrollBtn(!near);
  };

  return (
    <div className="relative flex-1 overflow-hidden flex flex-col bg-stone-50/50">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 chat-scrollbar"
      >
        {messages.length === 0 ? (
          <WelcomeScreen
            onLoadHistory={onLoadHistory}
            isHistoryLoading={isHistoryLoading}
          />
        ) : (
          <>
            {/* top sentinel */}
            <div ref={topSentinelRef} className="h-px" />

            {/* load older button */}
            {hasMoreHistory && (
              <div className="flex justify-center py-1 select-none">
                <button
                  onClick={() => {
                    const el = scrollRef.current;

                    if (el) {
                      heightBeforeRef.current = el.scrollHeight;

                      topBeforeRef.current = el.scrollTop;
                    }

                    onLoadHistory();
                  }}
                  disabled={isHistoryLoading}
                  className="
                    flex items-center gap-1.5
                    px-4 py-1.5
                    text-xs font-bold
                    text-zinc-600
                    bg-zinc-100
                    hover:bg-zinc-200
                    border border-zinc-200/80
                    rounded-full
                    transition-colors
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  {isHistoryLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    "↑ Tải tin nhắn cũ hơn"
                  )}
                </button>
              </div>
            )}

            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* typing indicator */}
            <TypingIndicator isVisible={isLoading && !isStreaming} />
          </>
        )}
      </div>

      {/* jump to bottom */}
      {showScrollBtn && messages.length > 0 && (
        <button
          onClick={() => {
            scrollToBottom("smooth");
            setShowScrollBtn(false);
          }}
          className="
              absolute bottom-4 left-1/2
              -translate-x-1/2
              flex items-center gap-1.5
              px-4 py-1.5
              bg-zinc-900 text-white
              text-xs font-semibold
              rounded-full
              shadow-lg shadow-zinc-950/20
              hover:bg-zinc-800
              hover:scale-105
              active:scale-95
              transition-transform duration-150
            "
        >
          <ChevronDown size={13} />
          Tin nhắn mới
        </button>
      )}
    </div>
  );
};

export default MessageList;
