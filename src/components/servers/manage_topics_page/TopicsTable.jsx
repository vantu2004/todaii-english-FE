import { useEffect, useState } from "react";
import { formatISODate } from "../../../utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "../Modal";
import { Pencil, Trash2, Check, X, ArrowUp, ArrowDown } from "lucide-react";
import {
  deleteTopic,
  toggleTopic,
  updateTopic,
} from "../../../api/servers/topicApi";

const TopicsTable = ({ columns, topics, reloadTopics, query, updateQuery }) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

  useEffect(() => {
    setEnabledStates(topics.map((topic) => topic.enabled));
  }, [topics]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const topicId = topics[index].id;
      await toggleTopic(topicId);
      await reloadTopics();
    } catch (err) {
      toast.error("Failed to toggle topic");
      console.error("Failed to toggle topic:", err);
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(topics[index].name);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedName("");
  };

  const handleSaveEdit = async (index) => {
    try {
      const topicId = topics[index].id;

      await updateTopic(topicId, { name: editedName });
      await reloadTopics();

      setEditingIndex(null);
      setEditedName("");

      toast.success("Topic updated successfully");
    } catch (error) {
      console.error("Error creating admin:", error);

      // Lấy danh sách lỗi từ response
      const errors = error.response?.data?.errors;

      if (errors && Array.isArray(errors)) {
        errors.forEach((err) => toast.error(err));
      } else {
        toast.error("Failed to update topic"); // fallback
      }
    }
  };

  const handleDeleteClick = (index) => {
    setSelectedTopicIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTopicIndex === null) return;

    try {
      const topicId = topics[selectedTopicIndex].id;

      await deleteTopic(topicId);
      await reloadTopics();

      toast.success("Topic deleted");
    } catch (err) {
      toast.error("Failed to delete topic");
      console.error("Failed to delete topic:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedTopicIndex(null);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full whitespace-nowrap">
          {/* Header */}
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
                        ? "cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                            <ArrowUp className="w-3 h-3 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-blue-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {topics.map((topic, i) => {
              const isEditing = editingIndex === i;

              return (
                <tr
                  key={i}
                  className="border-t border-gray-300 text-gray-700 dark:text-gray-400"
                >
                  <td className="px-4 py-3 text-xs font-semibold">
                    {topic.id}
                  </td>

                  {/* Editable Name */}
                  <td className="px-4 py-3 text-sm font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      topic.name
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">{topic.alias}</td>
                  <td className="px-4 py-3 text-sm">{topic.topic_type}</td>
                  <td className="px-4 py-3 text-sm">
                    {formatISODate(topic.updated_at)}
                  </td>

                  {/* Enable toggle */}
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

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 text-sm">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(i)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(i)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(i)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete modal */}
      {selectedTopicIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Topic"
          footer={
            <>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirmDelete();
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Delete
              </button>
            </>
          }
        >
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-blue-600">
              {topics[selectedTopicIndex]?.name}
            </span>
            ?
          </p>
        </Modal>
      )}
    </>
  );
};

export default TopicsTable;
