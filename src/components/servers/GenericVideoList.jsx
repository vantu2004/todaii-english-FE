import { useEffect, useState } from "react";
import RedirectToolbar from "../../components/servers/RedirectToolbar";
import Pagination from "../../components/servers/Pagination";
import { motion } from "framer-motion";
import { logError } from "../../utils/LogError";
import VideosTable from "../../components/servers/manage_videos_page/VideosTable";
import { useNavigate } from "react-router-dom";

const GenericVideoList = ({ title, fetchApi }) => {
  const REDIRECT_URL = "/server/video/create";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Query chung: page, size, sort, search
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
    { key: "title", label: "Title", sortField: "title" },
    { key: "author_name", label: "Author", sortField: "authorName" },
    { key: "provider_name", label: "Provider", sortField: "providerName" },
    { key: "views", label: "Views", sortField: "views" },
    { key: "updated_at", label: "Updated At", sortField: "updatedAt" },
    { key: "lyric", label: "Lyrics" },
    { key: "vocabulary", label: "Vocabularies" },
    { key: "enable", label: "Enable", sortField: "enabled" },
    { key: "action", label: "Actions" },
  ];

  const reloadVideos = async () => {
    try {
      setLoading(true);

      const data = await fetchApi(query);

      setVideos(data.content || []);

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
    reloadVideos();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-none">
          <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {title}
          </h2>

          <RedirectToolbar
            updateQuery={updateQuery}
            handleRedirect={() => navigate(REDIRECT_URL)}
          />

          <h4 className="mt-6 mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Videos Table
          </h4>
        </div>

        {/* Bảng */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
        >
          <VideosTable
            columns={columns}
            videos={videos}
            reloadVideos={reloadVideos}
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
    </>
  );
};

export default GenericVideoList;
