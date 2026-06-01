import { useEffect, useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import {
  Pencil,
  Trash2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  TextAlignStart,
} from "lucide-react";

import {
  deleteVocabGroup,
  toggleVocabGroup,
  updateVocabGroup,
} from "@/api/servers/vocabGroupApi";
import { logError } from "@/utils/LogError";
import { useNavigate } from "react-router-dom";

const VocabGroupsTable = ({
  columns,
  groups,
  reloadGroups,
  query,
  updateQuery,
}) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setEnabledStates(groups.map((g) => g.enabled));
  }, [groups]);

  const handleListClick = (index) => {
    const vocabGroupId = groups[index].id;
    navigate(`/server/vocab-group/${vocabGroupId}/vocab-deck`);
  };

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const id = groups[index].id;

      await toggleVocabGroup(id);
      await reloadGroups();
    } catch (err) {
      logError(err);
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(groups[index].name);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedName("");
  };

  const handleDeleteClick = (index) => {
    setSelectedGroupIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async (index) => {
    try {
      const id = groups[index].id;

      await updateVocabGroup(id, editedName);
      await reloadGroups();

      setEditingIndex(null);
      setEditedName("");

      toast.success("Vocab group updated successfully");
    } catch (error) {
      logError(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedGroupIndex === null) return;

    try {
      const id = groups[selectedGroupIndex].id;

      await deleteVocabGroup(id);
      await reloadGroups();

      setSelectedGroupIndex(null);
      setIsDeleteModalOpen(false);

      toast.success("Vocab group deleted");
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full whitespace-nowrap">
          {/* Header */}
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-gray-700 dark:hover:text-blue-400 transition-colors"
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
                            <ArrowUp className="w-3 h-3 text-gray-900" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-gray-900" />
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
            {groups.map((group, i) => {
              const isEditing = editingIndex === i;

              return (
                <tr
                  key={i}
                  className="border-t border-gray-100 text-gray-700 dark:text-gray-400"
                >
                  <td className="px-4 py-3 text-xs font-semibold">
                    {group.id}
                  </td>

                  {/* Editable Name */}
                  <td className="px-4 py-3 text-sm font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      group.name
                    )}
                  </td>

                  <td className="px-4 py-3 text-sm">{group.alias}</td>

                  <td className="px-4 py-3 text-sm">
                    {formatISODate(group.updated_at)}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleListClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                    >
                      <TextAlignStart className="w-4 h-4" />
                    </button>
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
                    <div className="flex items-center space-x-4 text-sm">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(i)}
                            className="p-2 text-gray-400 hover:text-green-700 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-400 hover:text-red-700 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(i)}
                            className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(i)}
                            className="p-2 text-gray-400 hover:text-red-700 rounded-lg transition-colors"
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
          </tbody>
        </table>
      </div>

      {/* Delete modal */}
      {selectedGroupIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Vocab Group
            </h2>
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
                Delete Group
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            <h3 className="text-sm text-gray-900">
              Are you sure you want to delete this vocab group?
            </h3>
            <p className="text-sm text-gray-700">
              You are about to permanently delete:
            </p>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm font-semibold text-gray-900">
                {groups[selectedGroupIndex]?.name}
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

export default VocabGroupsTable;
