import { useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
import { Eye, ArrowRightFromLine } from "lucide-react";
import ArticleViewModal from "./ArticleViewModal";
import { useNewsApiStore } from "@/stores/useNewsApiStore";
import { useNavigate } from "react-router-dom";

const ArticlesTable = ({ columns, articles }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const { setRawArticle } = useNewsApiStore();

  const navigate = useNavigate();

  const handleViewClick = (article) => {
    setSelectedArticle(article);
    setIsViewModalOpen(true);
  };

  const handleExportClick = (article) => {
    // Lưu article vào Zustand
    setRawArticle(article);

    navigate("/server/article/create");
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full table-auto">
          {/* === Table Header === */}
          <thead>
            <tr className="text-xs font-medium tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* === Table Body === */}
          <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-800 dark:bg-gray-900">
            {articles.map((article, i) => (
              <tr key={i} className="text-gray-700 dark:text-gray-400">
                {/* # */}
                <td className="px-4 py-3 text-sm">{i + 1}</td>

                {/* Source */}
                <td className="px-4 py-3 text-sm">
                  {article.source?.name || "-"}
                </td>

                {/* Title */}
                <td className="px-4 py-3 text-sm">
                  {article.author ? (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400 underline-offset-2 hover:underline transition-colors"
                    >
                      {article.title}
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Unknown</span>
                  )}
                </td>

                {/* Author */}
                <td className="px-4 py-3 text-sm">
                  {article.author || "Unknown"}
                </td>

                {/* Published At */}
                <td className="px-4 py-3 text-sm">
                  {formatISODate(article.published_at)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <button
                      onClick={() => handleViewClick(article)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg"
                      aria-label="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleExportClick(article)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg"
                      aria-label="Export"
                    >
                      <ArrowRightFromLine className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedArticle && (
        <ArticleViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          article={selectedArticle}
        />
      )}
    </>
  );
};

export default ArticlesTable;
