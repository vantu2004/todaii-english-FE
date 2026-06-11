import { useState, useRef, useCallback } from "react";
import { logError } from "@/utils/LogError";
import { getAllWordsCursor } from "@/api/servers/dictionaryApi";

export const useDictionaryCursor = (size = 50) => {
  const [items, setItems] = useState([]);

  // Dùng useRef cho lastId để nó update tức thời, không bị dính stale state (closure) khi cuộn nhanh
  const lastIdRef = useRef(0);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Dùng current của ref thay vì state
      const newItems = await getAllWordsCursor(lastIdRef.current, size);

      if (newItems && newItems.length > 0) {
        setItems((prev) => {
          // Khử trùng lặp (tránh trường hợp mạng lag, API trả về trùng data)
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNewItems = newItems.filter(
            (item) => !existingIds.has(item.id),
          );

          return [...prev, ...uniqueNewItems];
        });

        // Update ref lập tức
        lastIdRef.current = newItems[newItems.length - 1].id;

        if (newItems.length < size) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      logError(error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, size]);

  return { items, setItems, loadMore, loading, hasMore };
};
