import toast from "react-hot-toast";
import { createArticle } from "../../../../api/servers/articleApi";
import ArticleForm from "../../../../components/servers/manage_articles_page/ArticleForm";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CreateArticle = () => {
  const navigate = useNavigate();

  const handleCreateArticle = async (data) => {
    try {
      await createArticle(data);

      navigate("/server/article");
    } catch (error) {
      console.error("Error creating article:", error);

      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0]); // chỉ hiển thị lỗi đầu tiên
      } else {
        toast.error("Failed to create article");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Create Article
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
          initialData={{}}
          onSubmit={handleCreateArticle}
        />
      </motion.div>
    </div>
  );
};

export default CreateArticle;
