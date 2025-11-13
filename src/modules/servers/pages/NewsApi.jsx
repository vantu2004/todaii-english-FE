import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchArticlesFromNewsApi } from "../../../api/servers/article";
import { Loader, ExternalLink } from "lucide-react";
import ToolBar from "../../../components/servers/ToolBar";
import Pagination from "../../../components/servers/news_api_page/Pagination";
import ArticlesTable from "../../../components/servers/news_api_page/ArticlesTable";

const NewsApi = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Query filter state
  const [query, setQuery] = useState({
    keyword: "technology",
    pageSize: 10,
    page: 1,
    sortBy: "publishedAt",
  });

  const pagination = {
    totalElements: 100,
    totalPages: 10,
  };

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const reloadArticles = async () => {
    try {
      setLoading(true);

      const data = await fetchArticlesFromNewsApi(
        query.keyword,
        query.pageSize,
        query.page,
        query.sortBy
      );

      setArticles(data || []);
    } catch (err) {
      console.error("Error loading articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadArticles();
  }, [query]);

  const columns = [
    { key: "order", label: "#" },
    { key: "source_name", label: "Source" },
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "publishedAt", label: "Published At" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          News API
          <a
            href="https://newsapi.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-1 rounded-lg text-gray-600 dark:text-gray-400 
              hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="Visit News API"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </h2>
      </div>

      <ToolBar updateQuery={updateQuery} setIsModalOpen={null} />

      <div className="flex items-center gap-3">
        <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 flex-1">
          News Table
        </h4>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm mt-4">
        <ArticlesTable columns={columns} articles={articles} />
      </div>

      {/* Pagination */}
      <div className="flex-none mt-4">
        <Pagination
          query={query}
          updateQuery={updateQuery}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default NewsApi;
