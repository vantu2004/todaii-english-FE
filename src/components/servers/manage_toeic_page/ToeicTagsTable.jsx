import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import {
  Pencil,
  Trash2,
  AlertTriangle,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  Info,
} from "lucide-react";
import { deleteToeicTag } from "@/api/servers/toeicTagApi";
import { logError } from "@/utils/LogError";

const ToeicTagsTable = ({
  columns,
  tags,
  reloadTags,
  query,
  updateQuery,
  onSaveEdit,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPartNumber, setEditedPartNumber] = useState("");
  const [detailIndex, setDetailIndex] = useState(null);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedName(tags[index].name);
    setEditedPartNumber(
      tags[index].part_number !== null && tags[index].part_number !== undefined
        ? tags[index].part_number
        : "",
    );
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedName("");
    setEditedPartNumber("");
  };

  const handleSave = async (index) => {
    const tag = tags[index];
    if (editedName.trim() === "") return;
    let pNum = null;
    if (
      editedPartNumber !== "" &&
      editedPartNumber !== null &&
      editedPartNumber !== undefined
    ) {
      pNum = parseInt(editedPartNumber, 10);
      if (isNaN(pNum) || pNum < 1 || pNum > 7) {
        toast.error("Part number must be between 1 and 7");
        return;
      }
    }
    await onSaveEdit(tag.id, editedName, pNum);
    setEditingIndex(null);
    setEditedName("");
    setEditedPartNumber("");
  };

  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex === null) return;
    try {
      const id = tags[selectedIndex].id;
      await deleteToeicTag(id);
      await reloadTags();
      setSelectedIndex(null);
      setIsDeleteModalOpen(false);
      toast.success("Tag deleted successfully");
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
                const isActiveSort = query?.sortBy === col.sortField;

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

          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {tags.map((item, i) => {
              const isEditing = editingIndex === i;

              return (
                <tr
                  key={i}
                  className="border-t border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-semibold">{item.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">
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
                  <td className="px-4 py-3 text-sm">
                    {isEditing ? (
                      <input
                        type="number"
                        min={1}
                        max={7}
                        value={editedPartNumber}
                        onChange={(e) => setEditedPartNumber(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-700 dark:text-white"
                      />
                    ) : item.part_number !== undefined &&
                      item.part_number !== null ? (
                      item.part_number
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3 text-sm">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(i)}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setDetailIndex(i)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Detail"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(i)}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(i)}
                            className="p-2 text-red-600 hover:text-red-700 rounded-lg transition-colors"
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
            {tags.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No tags found.
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
                  Delete Tag
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
                Delete Tag
              </button>
            </div>
          }
        >
          <div className="space-y-3 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm text-gray-900 mb-2">
              Are you sure you want to delete this tag?
            </h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
              <p className="text-sm font-semibold text-gray-900">
                {tags[selectedIndex]?.name}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {detailIndex !== null && (
        <Modal
          isOpen={true}
          onClose={() => setDetailIndex(null)}
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg">
                <Info className="text-pink-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tag Details
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Detailed information about the tag
                </p>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDetailIndex(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4 bg-gradient-to-br from-slate-50 to-pink-50 rounded-2xl p-6 border border-pink-200/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Tag ID
                </span>
                <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                  #{tags[detailIndex]?.id}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Part Number
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {tags[detailIndex]?.part_number ||
                    tags[detailIndex]?.partNumber ||
                    "All Parts (Reusable)"}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Name
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {tags[detailIndex]?.name}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Alias
                </span>
                <p className="text-sm font-medium text-slate-700 mt-1">
                  {tags[detailIndex]?.alias}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ToeicTagsTable;
