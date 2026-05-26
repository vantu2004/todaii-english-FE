import { useState, useCallback, useRef } from "react";
import {
  sendMessageStream,
  getHistoryMessages,
  deleteHistoryMessages,
} from "@/api/clients/chatbotApi";

const MAX_HISTORY = 50;
const MAX_CHAR_LIMIT = 1024;

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // waiting for FIRST chunk
  const [isStreaming, setIsStreaming] = useState(false); // actively receiving chunks
  const [aiProvider, setAiProvider] = useState("OPENAI");
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // abort controller ref for canceling streaming
  const abortControllerRef = useRef(null);

  /**
   * Determine the role of a message item from various API formats.
   * Supports: role, sender, is_user, isUser fields.
   */
  const determineRole = (item) => {
    // Check 'role' field first (most standard)
    if (item.type) {
      const r = item.type.toLowerCase().trim();
      if (r === "user") return "user";
      if (r === "assistant" || r === "system" || r === "tool")
        return "assistant";
    }

    // Default fallback — if nothing matches, guess from content pattern
    return "user";
  };

  // Load paginated chat history from API.
  const loadHistory = useCallback(async () => {
    if (isHistoryLoading || !hasMoreHistory) return;

    setIsHistoryLoading(true);
    try {
      const size = 5;
      const data = await getHistoryMessages(historyPage, size);

      // Support both paginated { content: [] } and plain array responses
      const rawContent = data?.content || (Array.isArray(data) ? data : []);

      if (rawContent.length === 0) {
        setHasMoreHistory(false);
        return;
      }

      const mapped = rawContent.map((item) => ({
        id: item.id ? item.id.toString() : `hist-${Math.random()}`,
        role: determineRole(item),
        content: item.content || "",
        timestamp: item.timestamp || item.created_at || 0,
        isHistory: true,
      }));

      setMessages((prev) => {
        // Merge: filter out duplicates by ID
        const existingIds = new Set(prev.map((msg) => msg.id));
        const filteredNew = mapped.filter((msg) => !existingIds.has(msg.id));
        const combined = [...filteredNew, ...prev];

        // Sort oldest → newest by numeric ID (most reliable) then timestamp
        combined.sort((a, b) => {
          const idA = parseInt(a.id, 10);
          const idB = parseInt(b.id, 10);
          if (!isNaN(idA) && !isNaN(idB)) return idA - idB;
          return (a.timestamp || 0) - (b.timestamp || 0);
        });

        return combined;
      });

      setHistoryPage((p) => p + 1);
      // If fewer results than limit, we've reached the oldest messages
      if (rawContent.length < size) {
        setHasMoreHistory(false);
      }
    } catch (error) {
      console.error("Load chatbot history error:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [historyPage, isHistoryLoading, hasMoreHistory]);

  /**
   * Send a message and stream the assistant's response.
   */
  const sendMessage = useCallback(
    async (content) => {
      const trimmed = content?.trim();
      if (!trimmed) return;

      if (trimmed.length > MAX_CHAR_LIMIT) {
        throw new Error(
          `Câu hỏi quá dài (${trimmed.length}/${MAX_CHAR_LIMIT} ký tự).`,
        );
      }

      // Abort any in-progress stream
      abortControllerRef.current?.abort();

      // 1. Add user message
      const userMsg = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const next = [...prev, userMsg];
        return next.length > MAX_HISTORY
          ? next.slice(next.length - MAX_HISTORY)
          : next;
      });

      // 2. Create placeholder for streaming bot message
      setIsLoading(true);
      setIsStreaming(false);

      const botMsgId = `bot-${Date.now()}`;
      const botMsg = {
        id: botMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, botMsg]);

      let accumulatedText = "";
      let firstChunkReceived = false;

      try {
        for await (const chunk of sendMessageStream(trimmed, aiProvider)) {
          if (!firstChunkReceived) {
            firstChunkReceived = true;
            setIsLoading(false);
            setIsStreaming(true);
          }

          accumulatedText += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? {
                  ...msg,
                  content: accumulatedText,
                  isStreaming: true,
                }
                : msg,
            ),
          );
        }

        // stream completed
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                ...msg,
                content: accumulatedText,
                isStreaming: false,
              }
              : msg,
          ),
        );
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Chatbot Stream Error:", error);

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === botMsgId) {
              return {
                ...msg,
                content: accumulatedText
                  ? accumulatedText + "\n\n*(Kết nối bị gián đoạn)*"
                  : "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau.",
                isStreaming: false,
                isError: !accumulatedText,
              };
            }

            return msg;
          }),
        );
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [aiProvider],
  );

  /**
   * Clear all messages and reset history pagination.
   */
  const clearMessages = useCallback(async () => {
    abortControllerRef.current?.abort();

    try {
      await deleteHistoryMessages();
    } catch (error) {
      console.error("Failed to clear messages:", error);
    }

    setMessages([]);
    setHistoryPage(1);
    setHasMoreHistory(true);
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  return {
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
    MAX_CHAR_LIMIT,
  };
};
