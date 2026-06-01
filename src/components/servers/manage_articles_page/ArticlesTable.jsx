import { useEffect, useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Pilcrow,
  BookA,
} from "lucide-react";
import { toggleArticle, deleteArticle } from "@/api/servers/articleApi";
import ArticleViewModal from "./ArticleViewModal";
import { useNavigate } from "react-router-dom";
import { logError } from "@/utils/LogError";

const ArticlesTable = ({
  columns,
  articles,
  reloadArticles,
  query,
  updateQuery,
}) => {
  const [statusStates, setStatusStates] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setStatusStates(articles.map((a) => a.enabled ?? true));
  }, [articles]);

  const handleToggle = async (index) => {
    setStatusStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const articleId = articles[index].id;

      await toggleArticle(articleId);
      await reloadArticles();
    } catch (error) {
      logError(error);
    }
  };

  const handleVocabClick = (index) => {
    const articleId = articles[index].id;
    navigate(`/server/article/${articleId}/vocab`);
  };

  const handleParagraphClick = (index) => {
    const articleId = articles[index].id;
    navigate(`/server/article/${articleId}/paragraph`);
  };

  const handleViewClick = (index) => {
    setSelectedArticle(articles[index]);
    setIsViewModalOpen(true);
  };

  const handleUpdateClick = (index) => {
    const articleId = articles[index].id;
    navigate(`/server/article/${articleId}/update`);
  };

  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex === null) return;

    try {
      const articleId = articles[selectedIndex].id;

      await deleteArticle(articleId);
      await reloadArticles();

      setSelectedIndex(null);
      setIsDeleteModalOpen(false);

      toast.success("Article deleted");
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full table-auto">
          {/* Header */}
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-gray-700 transition-colors"
                        : ""
                    }`}
                    onClick={() => {
                      if (!isSortable) return;
                      const newDirection = isActiveSort
                        ? query.direction === "asc"
                          ? "desc"
                          : "asc"
                        : "asc";
                      updateQuery({
                        sortBy: col.sortField,
                        direction: newDirection,
                        page: query.page,
                      });
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {isSortable && isActiveSort && (
                        <>
                          {query.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-gray-900" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-gray-900" />
                          )}
                        </>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((a, i) => (
              <tr key={a.id || i} className="text-gray-700">
                <td className="px-4 py-3 text-sm">{a.id}</td>
                <td className="px-4 py-3 text-sm">{a.source_name}</td>
                <td className="px-4 py-3 text-sm">{a.author}</td>
                <td className="px-4 py-3 text-sm">
                  <a
                    href={a.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 hover:underline line-clamp-2"
                    title={a.title}
                  >
                    {a.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm">{a.views}</td>
                <td className="px-4 py-3 text-sm">
                  {formatISODate(a.published_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <button
                      onClick={() => handleParagraphClick(i)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label="Paragraph"
                    >
                      <Pilcrow className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <button
                      onClick={() => handleVocabClick(i)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label="Vocabulary"
                    >
                      <BookA className="w-4 h-4" />
                    </button>
                  </div>
                </td>

                {/* Enable toggle */}
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleToggle(i)}
                    className={`relative cursor-pointer w-10 h-5 rounded-full border transition-colors duration-300 ease-in-out ${
                      statusStates[i]
                        ? "bg-green-400 border-green-400"
                        : "bg-neutral-300 border-neutral-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1/2 left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${
                        statusStates[i] ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center text-sm space-x-4">
                    <button
                      onClick={() => handleViewClick(i)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleUpdateClick(i)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                      aria-label="Update"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(i)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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

      {/* Delete Modal */}
      {selectedIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Delete Article
                </h2>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirmDelete();
                  setIsDeleteModalOpen(false);
                }}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <h3 className="text-sm text-gray-900">
              Are you sure you want to delete this article?
            </h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-900">
                {selectedIndex !== null ? articles[selectedIndex].title : ""}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedIndex !== null ? articles[selectedIndex].author : ""}
              </p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              ⚠️ This action is permanent and cannot be reversed.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ArticlesTable;
