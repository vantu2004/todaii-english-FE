import { createArticle } from "../../../../api/servers/articleApi";
import ArticleForm from "../../../../components/servers/manage_articles_page/ArticleForm";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useNewsApiStore } from "../../../../stores/useNewsApiStore";
import { useEffect, useState } from "react";
import { logError } from "../../../../utils/LogError";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});
  const { rawArticle, clearRawArticle } = useNewsApiStore();

  const handleCreateArticle = async (data) => {
    try {
      await createArticle(data);

      navigate("/server/article");
    } catch (error) {
      logError(error);
    }
  };

  const normalizeRawArticle = (raw) => {
    if (!raw) return {};

    return {
      source_id: raw.source?.id || "",
      source_name: raw.source?.name || "",
      author: raw.author || "",
      title: raw.title || "",
      description: raw.description || "",
      source_url: raw.url || "",
      image_url: raw.url_to_image || "",
      published_at: raw.published_at || "",
      cefr_level: "", // default
      topic_ids: [], // default
    };
  };

  // Khi mở trang, nếu có rawArticle thì chuẩn hóa
  useEffect(() => {
    if (rawArticle) {
      const normalized = normalizeRawArticle(rawArticle);
      setInitialData(normalized);
    }

    return () => clearRawArticle();
  }, [rawArticle, clearRawArticle]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Articles
        </h2>
      </div>

      {/* Article Form */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <ArticleForm
          mode="create"
          initialData={initialData}
          onSubmit={handleCreateArticle}
        />
      </motion.div>
    </div>
  );
};

export default CreateArticle;
