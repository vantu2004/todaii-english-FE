import { useState } from "react";
import { formatDate } from "../../../utils/FormatDate";
import { Eye, ArrowRightFromLine } from "lucide-react";
import ArticleViewModal from "./ArticleViewModal";

const ArticlesTable = ({ columns, articles }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleViewClick = (article) => {
    setSelectedArticle(article);
    setIsViewModalOpen(true);
  };

  const handleExportClick = (article) => {
    console.log("Export article:", article.title);
    // 👉 Sau này bạn có thể dùng navigate("/export/article/" + article.id)
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full table-auto">
          {/* === Table Header === */}
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* === Table Body === */}
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
            {articles.map((article, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 text-gray-700 dark:text-gray-400"
              >
                {/* # */}
                <td className="px-4 py-3 text-sm font-semibold">{i + 1}</td>

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
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-2 hover:underline transition-colors"
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
                  {formatDate(article.published_at)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <button
                      onClick={() => handleViewClick(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleExportClick(article)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      aria-label="Export"
                    >
                      <ArrowRightFromLine className="w-5 h-5" />
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
