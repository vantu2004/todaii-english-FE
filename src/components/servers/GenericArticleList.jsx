import { useEffect, useState } from "react";
import Pagination from "../../components/servers/Pagination";
import ArticlesTable from "../../components/servers/manage_articles_page/ArticlesTable";
import { useNavigate } from "react-router-dom";
import RedirectToolbar from "../../components/servers/RedirectToolbar";
import { motion } from "framer-motion";
import { logError } from "../../utils/LogError";
import { useHeaderContext } from "../../hooks/servers/useHeaderContext";

const GenericArticleList = ({ title, fetchApi }) => {
  const { setHeader } = useHeaderContext();

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
    { key: "paragraph", label: "Paragraphs" },
    { key: "vocabulary", label: "Vocabularies" },
    { key: "enable", label: "Enable", sortField: "enabled" },
    { key: "actions", label: "Actions" },
  ];

  const reloadArticles = async () => {
    try {
      setLoading(true);

      const data = await fetchApi(query);

      setArticles(data.content || []);

      setPagination({
        totalElements: data.total_elements,
        totalPages: data.total_pages,
        first: data.first,
        last: data.last,
      });
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHeader({
      title: "Manage Articles",
      breadcrumb: [
        { label: "Home", to: "/server" },
        ...(window.location.pathname !== "/server/article"
          ? [{ label: "Manage Article Topics", to: "/server/article-topic" }]
          : []),
        { label: title },
      ],
    });
  }, []);

  useEffect(() => {
    reloadArticles();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  return (
    <div className="flex flex-col h-full">
      <RedirectToolbar
        updateQuery={updateQuery}
        handleRedirect={() => navigate(REDIRECT_URL)}
      />
      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <ArticlesTable
          columns={columns}
          articles={articles}
          reloadArticles={reloadArticles}
          query={query}
          updateQuery={updateQuery}
        />
      </motion.div>

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

export default GenericArticleList;
