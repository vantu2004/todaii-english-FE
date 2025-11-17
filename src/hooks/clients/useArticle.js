// src/hooks/clients/useArticles.js
import { useState, useEffect } from "react";
import {
  getLastestArticles,
  getTopArticles,
} from "../../api/clients/articleApi";

const useArticle = (limit = 10) => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [topArticles, setTopArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both latest and top articles in parallel
        const [latestData, topData] = await Promise.all([
          getLastestArticles(limit),
          getTopArticles(limit),
        ]);

        setLatestArticles(latestData);
        setTopArticles(topData);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [limit]);

  return { latestArticles, topArticles, loading, error };
};

export default useArticle;
