import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchArticles } from "../../../../api/servers/articleApi";
import Pagination from "../../../../components/servers/Pagination";
import ArticlesTable from "../../../../components/servers/manage_articles_page/ArticlesTable";
import { useNavigate } from "react-router-dom";
import RedirectToolbar from "../../../../components/servers/RedirectToolbar";

const ManageArticles = () => {
  const REDIRECT_URL = "/server/article/create";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // state chung cho phân trang, sort, search
  const [query, setQuery] = useState({
    page: 1,
    size: 10,
    sortBy: "id",
    direction: "desc",
    keyword: "",
  });

  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

  const columns = [
    { key: "id", label: "ID", sortField: "id" },
    { key: "source_name", label: "Source Name", sortField: "sourceName" },
    { key: "title", label: "Title", sortField: "title" },
    { key: "author", label: "Author", sortField: "author" },
    { key: "views", label: "Views", sortField: "views" },
    { key: "publishedAt", label: "Published At", sortField: "publishedAt" },
    { key: "enable", label: "Enable", sortField: "enabled" },
    { key: "actions", label: "Actions" },
  ];

  const reloadArticles = async () => {
    try {
      setLoading(true);
      const data = await fetchArticles(
        query.page,
        query.size,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setArticles(data.content || []);

      setPagination({
        totalElements: data.total_elements,
        totalPages: data.total_pages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      console.error("Error loading articles:", err);
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadArticles();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Articles
        </h2>

        <RedirectToolbar
          updateQuery={updateQuery}
          handleRedirect={() => navigate(REDIRECT_URL)}
        />

        <h4 className="mt-6 mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Articles Table
        </h4>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm">
        <ArticlesTable
          columns={columns}
          articles={articles}
          reloadArticles={reloadArticles}
          query={query}
          updateQuery={updateQuery}
        />
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

export default ManageArticles;
