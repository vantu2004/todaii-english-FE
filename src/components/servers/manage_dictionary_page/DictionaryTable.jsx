import { useState, useRef } from "react";
import { formatISODate } from "@/utils/FormatDate";
import toast from "react-hot-toast";
import { Eye, Pencil, Trash2, ArrowUp, ArrowDown, Volume2 } from "lucide-react";
import Modal from "@/components/servers/Modal";
import DictionaryFormModal from "./DictionaryFormModal";
import {
  deleteDictionaryEntry,
  updateDictionaryEntry,
} from "@/api/servers/dictionaryApi";
import DictionaryViewModal from "./DictionaryViewModal";
import { logError } from "@/utils/LogError";

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
      logError(error);
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
      logError(err);
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
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
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
                            <ArrowUp className="w-3 h-3 text-gray-900 dark:text-gray-300" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-gray-900 dark:text-gray-300" />
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
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
            {dictionary.map((entry, i) => (
              <tr
                key={i}
                className="border-t border-gray-100 text-gray-700 dark:text-gray-400"
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
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition"
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
                  {formatISODate(entry.updated_at)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3 text-sm">
                    {/* View */}
                    <button
                      onClick={() => handleViewClick(i)}
                      className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleUpdateClick(i)}
                      className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteClick(i)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Dictionary Entry
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                This action cannot be undone
              </p>
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
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Entry
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-sm text-gray-900 mb-2">
                  Are you sure you want to delete this dictionary entry?
                </h3>
                <p className="text-gray-700 mb-4">
                  You are about to permanently delete the entry:
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {dictionary[selectedDictionaryIndex]?.headword}
                  </p>
                  {dictionary[selectedDictionaryIndex]?.ipa && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {dictionary[selectedDictionaryIndex].ipa}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
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
