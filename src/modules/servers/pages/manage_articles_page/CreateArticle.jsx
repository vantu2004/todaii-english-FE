import toast from "react-hot-toast";
import { createArticle } from "../../../../api/servers/articleApi";
import ArticleForm from "../../../../components/servers/manage_articles_page/ArticleForm";

const CreateArticle = () => {
  const handleCreateArticle = async (data) => {
    try {
      await createArticle(data);
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
      <div className="flex-1 overflow-auto">
        <ArticleForm
          mode="update"
          initialData={{}}
          onSubmit={handleCreateArticle}
        />
      </div>
    </div>
  );
};

export default CreateArticle;
