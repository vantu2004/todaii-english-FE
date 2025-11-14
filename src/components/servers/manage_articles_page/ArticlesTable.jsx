import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "../Modal";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Pilcrow,
  Languages,
} from "lucide-react";
import { toggleArticle, deleteArticle } from "../../../api/servers/articleApi";
import ArticleViewModal from "./ArticleViewModal";
import { useNavigate } from "react-router-dom";

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
    } catch (error) {
      console.error("Error toggling article:", error);

      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0]); // chỉ hiển thị lỗi đầu tiên
      } else {
        toast.error("Failed to toggle article");
      }
    } finally {
      await reloadArticles();
    }
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
      toast.error("Failed to delete article");
      console.error("Failed to delete article:", err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full table-auto">
          {/* Header */}
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-300 bg-gray-50">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-blue-600 transition-colors"
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
                            <ArrowUp className="w-3 h-3 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-blue-600" />
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
                <td className="px-4 py-3 text-sm font-semibold">{a.id}</td>
                <td className="px-4 py-3 text-sm">{a.source_name}</td>
                <td className="px-4 py-3 text-sm">{a.author}</td>
                <td className="px-4 py-3 text-sm">
                  <a
                    href={a.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline line-clamp-2"
                    title={a.title}
                  >
                    {a.title}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm">{a.views}</td>
                <td className="px-4 py-3 text-sm">
                  {formatDate(a.published_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <button
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      aria-label="Paragraph"
                    >
                      <Pilcrow className="w-5 h-5" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      aria-label="Vocabulary"
                    >
                      <Languages className="w-5 h-5" />
                    </button>
                  </div>
                </td>
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleUpdateClick(i)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      aria-label="Update"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(i)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
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
              <div className="p-2 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Delete Article
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirmDelete();
                  setIsDeleteModalOpen(false);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Article
              </button>
            </div>
          }
        >
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border-2 border-red-200/50">
            <h3 className="font-bold text-gray-900 mb-2 text-lg">
              Are you sure you want to delete this article?
            </h3>
            <p className="text-gray-700 mb-4">
              You are about to permanently delete:
            </p>
            <div className="bg-white rounded-lg p-3 border border-red-300 mb-4">
              <p className="text-sm font-semibold text-red-700">
                {selectedIndex !== null ? articles[selectedIndex].title : ""}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedIndex !== null ? articles[selectedIndex].author : ""}
              </p>
            </div>
            <p className="text-xs text-red-600 leading-relaxed">
              ⚠️ This action is permanent and cannot be reversed.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ArticlesTable;
