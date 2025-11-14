import { useState, useRef } from "react";
import { formatDate } from "../../../utils/FormatDate";
import toast from "react-hot-toast";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Volume2,
  AlertTriangle,
} from "lucide-react";
import Modal from "../Modal";
import DictionaryFormModal from "./DictionaryFormModal";
import {
  deleteDictionaryEntry,
  updateDictionaryEntry,
} from "../../../api/servers/dictionaryApi";
import DictionaryViewModal from "./DictionaryViewModal";

const DictionaryTable = ({
  columns,
  dictionary,
  reloadDictionary,
  query,
  updateQuery,
}) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDictionaryIndex, setSelectedDictionaryIndex] = useState(null);
  const [selectedDictionary, setSelectedDictionary] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  const handleViewClick = (index) => {
    setSelectedDictionary(dictionary[index]);
    setIsViewModalOpen(true);
  };

  const handleUpdateClick = (index) => {
    setSelectedDictionaryIndex(index);
    setSelectedDictionary(dictionary[index]);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (index) => {
    setSelectedDictionaryIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmUpdate = async (data) => {
    if (selectedDictionaryIndex === null) return;

    try {
      const id = dictionary[selectedDictionaryIndex].id;

      await updateDictionaryEntry(id, data);
      await reloadDictionary();

      setSelectedDictionaryIndex(null);
      setSelectedDictionary(null);
      setIsUpdateModalOpen(false);

      toast.success("Dictionary updated successfully");
    } catch (error) {
      console.error("Error updating dictionary entry:", error);

      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors) && errors.length > 0) {
        toast.error(errors[0]); // chỉ hiển thị lỗi đầu tiên
      } else {
        toast.error("Failed to update dictionary entry");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDictionaryIndex === null) return;
    try {
      const id = dictionary[selectedDictionaryIndex].id;

      await deleteDictionaryEntry(id);
      await reloadDictionary();

      setSelectedDictionaryIndex(null);
      setIsDeleteModalOpen(false);

      toast.success("Dictionary entry deleted");
    } catch (err) {
      toast.error("Failed to delete dictionary entry");
    }
  };

  const handlePlayAudio = async (index, audio_url) => {
    if (audio_url) {
      setPlayingIndex(index);
      try {
        const audio = new Audio(audio_url);
        audio.onended = () => setPlayingIndex(null);
        await audio.play();
      } catch (err) {
        console.error(err);
        toast.error("Audio playback failed");
        setPlayingIndex(null);
      }
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full whitespace-nowrap">
          {/* === Table Header === */}
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

          {/* === Table Body === */}
          <tbody className="bg-white divide-y divide-gray-300 dark:divide-gray-700 dark:bg-gray-800">
            {dictionary.map((entry, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 text-gray-700 dark:text-gray-400"
              >
                {/* ID */}
                <td className="px-4 py-3 text-xs font-semibold">{entry.id}</td>

                {/* Headword */}
                <td className="px-4 py-3 text-sm font-semibold">
                  {entry.headword}
                </td>

                {/* IPA */}
                <td className="px-4 py-3 text-sm text-gray-600">
                  {entry.ipa ? entry.ipa : "-"}
                </td>

                {/* Audio */}
                <td className="px-4 py-3 text-sm">
                  {entry.audio_url ? (
                    <button
                      onClick={() => handlePlayAudio(i, entry.audio_url)}
                      disabled={playingIndex === i}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <Volume2 className="w-5 h-5" />
                      {playingIndex === i ? "Playing..." : "Play"}
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">No audio</span>
                  )}
                </td>

                {/* Updated At */}
                <td className="px-4 py-3 text-sm">
                  {formatDate(entry.updated_at)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3 text-sm">
                    {/* View */}
                    <button
                      onClick={() => handleViewClick(i)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleUpdateClick(i)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteClick(i)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      {selectedDictionary && (
        <DictionaryViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          dictionary={selectedDictionary}
        />
      )}

      {/* Update Modal */}
      {selectedDictionary && (
        <DictionaryFormModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          mode="update"
          initialData={selectedDictionary}
          onSubmit={handleConfirmUpdate}
        />
      )}

      {/* Delete Confirmation */}
      {selectedDictionaryIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Delete Dictionary Entry
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
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Entry
              </button>
            </div>
          }
        >
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border-2 border-amber-200/50">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  Are you sure you want to delete this dictionary entry?
                </h3>
                <p className="text-gray-700 mb-4">
                  You are about to permanently delete the entry:
                </p>
                <div className="bg-white rounded-lg p-3 border border-amber-300 mb-4">
                  <p className="text-sm font-semibold text-amber-700">
                    {dictionary[selectedDictionaryIndex]?.headword}
                  </p>
                  {dictionary[selectedDictionaryIndex]?.ipa && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {dictionary[selectedDictionaryIndex].ipa}
                    </p>
                  )}
                </div>
                <p className="text-xs text-amber-600 leading-relaxed">
                  ⚠️ This action is permanent and cannot be reversed. The word
                  and all its definitions will be deleted.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DictionaryTable;
