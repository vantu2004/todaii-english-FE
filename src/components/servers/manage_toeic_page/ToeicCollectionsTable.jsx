import { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { formatISODate } from "@/utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import {
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  TextAlignStart,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  deleteToeicCollection,
  toggleToeicCollectionEnabled,
} from "@/api/servers/toeicCollectionApi";
import { logError } from "@/utils/LogError";

const truncateChars = (str, maxChars = 50) => {
  if (!str) return "";
  if (str.length > maxChars) {
    return str.substring(0, maxChars) + "...";
  }
  return str;
};

const ToeicCollectionsTable = ({
  columns,
  collections,
  reloadCollections,
  query,
  updateQuery,
  onEdit,
  onSaveEdit,
}) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const handleTestsClick = (id) => {
    navigate(`/server/toeic-collection/${id}/tests`);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(collections[index].name || "");
    setEditedDescription(collections[index].description || "");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedName("");
    setEditedDescription("");
  };

  const handleSaveEdit = async (index) => {
    const item = collections[index];
    if (editedName.trim() === "") return;
    await onSaveEdit(item.id, editedName, editedDescription);
    setEditingIndex(null);
  };

  useEffect(() => {
    setEnabledStates(collections.map((c) => c.enabled));
  }, [collections]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const id = collections[index].id;
      await toggleToeicCollectionEnabled(id);
      await reloadCollections();
    } catch (err) {
      logError(err);
      // Revert state if error
      setEnabledStates((prev) => {
        const newStates = [...prev];
        newStates[index] = !newStates[index];
        return newStates;
      });
    }
  };

  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex === null) return;
    try {
      const id = collections[selectedIndex].id;
      await deleteToeicCollection(id);
      await reloadCollections();
      setSelectedIndex(null);
      setIsDeleteModalOpen(false);
      toast.success("Collection deleted successfully");
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                        <span className="inline-flex items-center">
                          {query.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-gray-900 dark:text-gray-100" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-gray-900 dark:text-gray-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {collections.map((item, i) => {
              const isEditing = editingIndex === i;

              return (
                <tr
                  key={i}
                  className="border-t border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-semibold">{item.id}</td>
                  <td className="px-4 py-3 text-sm font-medium whitespace-normal">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-700 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.alias}</td>

                  <td
                    className="px-4 py-3 text-sm max-w-xs cursor-help whitespace-normal"
                    title={item.description || ""}
                  >
                    {isEditing ? (
                      <TextareaAutosize
                        minRows={1}
                        maxRows={5}
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-700 dark:text-white resize-none"
                      />
                    ) : (
                      truncateChars(item.description, 50)
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleTestsClick(item.id)}
                      className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                      <TextAlignStart className="w-4 h-4" />
                    </button>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {formatISODate(item.updatedAt || item.updated_at)}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleToggle(i)}
                      className={`relative cursor-pointer w-10 h-5 rounded-full border transition-colors duration-300 ease-in-out ${
                        enabledStates[i]
                          ? "bg-green-400 border-green-400"
                          : "bg-neutral-300 border-neutral-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1/2 left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${
                          enabledStates[i] ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 text-sm">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(i)}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(i)}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                            title="Edit directly"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(i)}
                            className="p-2 text-red-600 hover:text-red-700 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {collections.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No collections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Delete Collection
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
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Collection
              </button>
            </div>
          }
        >
          <div className="space-y-3 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm text-gray-900 mb-2">
              Are you sure you want to delete this collection?
            </h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
              <p className="text-sm font-semibold text-gray-900">
                {collections[selectedIndex]?.name}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ToeicCollectionsTable;
