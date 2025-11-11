import { useEffect, useState, useRef } from "react";
import { formatDate } from "../../../utils/FormatDate";
import toast from "react-hot-toast";
import { Eye, Pencil, Trash2, ArrowUp, ArrowDown, Volume2 } from "lucide-react";
import Modal from "../Modal";
import DictionaryFormModal from "./DictionaryFormModal";

const DictionaryTable = ({
  columns,
  dictionary,
  reloadDictionary,
  query,
  updateQuery,
}) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDictionaryIndex, setSelectedDictionaryIndex] = useState(null);
  const [selectedDictionary, setSelectedDictionary] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setEnabledStates(dictionary.map((item) => item.enabled));
  }, [dictionary]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const id = dictionary[index].id;
      await toggleDictionary(id);
      await reloadDictionary();
    } catch (err) {
      toast.error("Failed to toggle dictionary entry");
      console.error(err);
    }
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

  const handleViewClick = (index) => {
    setSelectedDictionary(dictionary[index]);
    setIsViewModalOpen(true);
  };

  const handleConfirmUpdate = async (data) => {
    if (selectedDictionaryIndex === null) return;
    try {
      const id = dictionary[selectedDictionaryIndex].id;
      await updateDictionary(id, data);
      await reloadDictionary();
      setIsUpdateModalOpen(false);
      toast.success("Dictionary updated successfully");
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors && Array.isArray(errors))
        errors.forEach((e) => toast.error(e));
      else toast.error("Failed to update dictionary");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDictionaryIndex === null) return;
    try {
      const id = dictionary[selectedDictionaryIndex].id;
      await deleteDictionary(id);
      await reloadDictionary();
      toast.success("Dictionary entry deleted");
    } catch (err) {
      toast.error("Failed to delete dictionary entry");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedDictionaryIndex(null);
    }
  };

  const handlePlayAudio = (audioUrl) => {
    if (!audioUrl) {
      toast.error("No audio available");
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(audioUrl);
    audioRef.current.play().catch(() => toast.error("Failed to play audio"));
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
                      onClick={() => handlePlayAudio(entry.audio_url)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <Volume2 className="w-5 h-5" />
                      Play
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">No audio</span>
                  )}
                </td>

                {/* Updated At */}
                <td className="px-4 py-3 text-sm">
                  {formatDate(entry.updated_at)}
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
      {/* {selectedDictionary && (
        <DictionaryViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          dictionary={selectedDictionary}
        />
      )} */}

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
          title="Delete Dictionary Entry"
          footer={
            <>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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
              {dictionary[selectedDictionaryIndex]?.headword}
            </span>
            ?
          </p>
        </Modal>
      )}
    </>
  );
};

export default DictionaryTable;
