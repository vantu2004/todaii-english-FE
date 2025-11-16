import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchArticle } from "../../../../api/servers/articleApi";
import { motion } from "framer-motion";
import ArticleDetails from "../../../../components/servers/manage_articles_page/ArticleDetails";
import ListParagraphs from "../../../../components/servers/manage_articles_page/ListParagraphs";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { logError } from "../../../../utils/LogError";

const ManageParagraphs = () => {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleFetchArticle = async () => {
    try {
      const data = await fetchArticle(id);
      setArticle(data);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchArticle();
  }, [id]);

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
      {/* Header */}
      <div className="flex-none flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Paragraphs
        </h2>

        <div className="flex items-center gap-3">
          {/* Reload */}
          <button
            onClick={handleFetchArticle}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow-md active:scale-95 transition-all"
            aria-label="Reload"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-95 transition-all"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm p-4"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Column 1: Article Details */}
          <div className="overflow-auto max-h-[calc(100vh-150px)]">
            <ArticleDetails article={article} />
          </div>

          {/* Column 2: Paragraph Form */}
          <div className="overflow-auto max-h-[calc(100vh-150px)]">
            <ListParagraphs
              articleId={article.id}
              paragraphs={article.paragraphs}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageParagraphs;
