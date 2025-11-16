import { useEffect, useState } from "react";
import { filterArticles } from "../../api/clients/articleApi";
export default function useArticleSearch(query) {
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.keyword?.trim()) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await filterArticles(query);
        setResults(data.content || []);
        setTotalResults(data.total_elements || 0);
        setTotalPages(data.total_pages || 0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { results, totalResults, totalPages, loading };
}
