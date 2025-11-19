import toast from "react-hot-toast";
import {
  fetchArticle,
  updateArticle,
} from "../../../../api/servers/articleApi";
import ArticleForm from "../../../../components/servers/manage_articles_page/ArticleForm";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const UpdateArticle = () => {
  const { setHeader } = useHeaderContext();

  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      title: "Manage Articles",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage Articles", to: "/server/article" },
        { label: "Update Article" },
      ],
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchArticle(id);
        setArticle(data);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdateArticle = async (formData) => {
    try {
      await updateArticle(id, formData);
      toast.success("Article updated!");

      navigate("/server/article");
    } catch (error) {
      logError(error);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (!article) {
    return (
      <div className="p-8 text-red-500">
        Cannot load article. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <ArticleForm
          mode="update"
          initialData={article}
          onSubmit={handleUpdateArticle}
        />
      </motion.div>
    </div>
  );
};

export default UpdateArticle;
