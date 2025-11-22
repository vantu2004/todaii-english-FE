import { useState, useEffect, useCallback } from "react";
import { getArticlesByDate } from "../../api/clients/articleApi";

const useArticleByDate = (initialDate = new Date()) => {
  const [articlesByDate, setArticlesByDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch articles when date changes
  useEffect(() => {
    const fetchByDate = async () => {
      try {
        setLoading(true);
        setError(null);
        setPage(1);

        const data = await getArticlesByDate(selectedDate, 1, 10);

        setArticlesByDate(data.content || []);
        setHasMore(data.total_pages > 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles for selected date.");
      } finally {
        setLoading(false);
      }
    };

    fetchByDate();
  }, [selectedDate]);

  // Load more articles (pagination)
  const loadMoreArticles = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      setError(null);

      const nextPage = page + 1;
      const data = await getArticlesByDate(selectedDate, nextPage, 1);

      setArticlesByDate((prev) => [...prev, ...data.content]);
      setPage(nextPage);
      setHasMore(nextPage < data.total_pages);
    } catch (err) {
      console.error(err);
      setError("Failed to load more articles.");
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page, selectedDate]);

  return {
    articlesByDate,
    selectedDate,
    setSelectedDate,
    hasMore,
    loading,
    error,
    loadMoreArticles,
  };
};

export default useArticleByDate;
