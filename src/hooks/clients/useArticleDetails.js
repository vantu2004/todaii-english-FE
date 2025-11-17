import { useState, useEffect } from "react";
import { getArticleById } from "../../api/clients/articleApi";

const useArticleDetails = (articleId) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!articleId) {
      setLoading(false);
      return;
    }

    const fetchArticleDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getArticleById(articleId);
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load article details.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [articleId]);

  return { article, loading, error };
};

export default useArticleDetails;
