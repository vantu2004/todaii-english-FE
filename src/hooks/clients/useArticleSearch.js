import { useEffect, useState } from "react";
import { filterArticles } from "../../api/clients/articleApi";
import { logError } from "../../utils/LogError";

export default function useArticleSearch(query) {
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await filterArticles(query);

        setResults(data.content || []);
        setTotalResults(data.total_elements || 0);
        setTotalPages(data.total_pages || 0);
      } catch (error) {
        logError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    // ko dùng quan sát query nữa mà đổi qua quan sát giá trị từng field bên trong
    query.keyword,
    query.sourceName,
    query.topicId,
    query.cefrLevel,
    query.minViews,
    query.page,
    query.size,
    query.sortBy,
    query.direction,
  ]);

  return { results, totalResults, totalPages, loading };
}
