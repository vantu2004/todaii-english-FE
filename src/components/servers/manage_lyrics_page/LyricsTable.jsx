import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Pencil,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import { logError } from "@/utils/LogError";
import { deleteLyric, updateLyric } from "@/api/servers/lyricApi";
import LyricFormModal from "./LyricFormModal";

const LyricsTable = ({ columns, lyrics, reloadLyrics, query, updateQuery }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedLyric, setSelectedLyric] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdateClick = (index) => {
    setSelectedIndex(index);
    setSelectedLyric(lyrics[index]);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmUpdate = async (lyric) => {
    if (selectedIndex === null) return;

    try {
      const lyricId = lyrics[selectedIndex].id;

      await updateLyric(lyricId, lyric);
      await reloadLyrics();

      setSelectedIndex(null);
      setSelectedLyric(null);
      setIsUpdateModalOpen(false);

      toast.success("Admin updated successfully");
    } catch (error) {
      logError(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex === null) return;
    try {
      await deleteLyric(lyrics[selectedIndex].id);
      await reloadLyrics();

      toast.success("Lyric deleted");

      setIsDeleteModalOpen(false);
      setSelectedIndex(null);
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full whitespace-nowrap">
          {/* === HEADER === */}
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;
                const direction = query.direction;

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${isSortable
                        ? "cursor-pointer select-none hover:text-gray-700 transition"
                        : ""
                      }`}
                    onClick={() => {
                      if (!isSortable) return;

                      const newDirection =
                        isActiveSort && direction === "asc" ? "desc" : "asc";

                      updateQuery({
                        sortBy: col.sortField,
                        direction: newDirection,
                      });
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}

                      {isSortable && isActiveSort && (
                        <>
                          {direction === "asc" ? (
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

          {/* === BODY === */}
          <tbody className="bg-white divide-y divide-gray-200">
            {lyrics.map((lyric, i) => (
              <tr key={i} className="text-gray-700">
                <td className="px-4 py-3 text-sm">{lyric.id}</td>
                <td className="px-4 py-3 text-sm">{lyric.line_order}</td>
                <td className="px-4 py-3 text-sm">{lyric.start_ms}</td>
                <td className="px-4 py-3 text-sm">{lyric.end_ms}</td>
                <td className="px-4 py-3 text-sm max-w-[300px] truncate">
                  {lyric.text_en}
                </td>
                <td className="px-4 py-3 text-sm max-w-[300px] truncate">
                  {lyric.text_vi}
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleUpdateClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition"
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

      {/* === UPDATE MODAL === */}
      {selectedLyric && (
        <LyricFormModal
          isOpen={isUpdateModalOpen}
          mode="update"
          initialData={selectedLyric}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleConfirmUpdate}
        />
      )}

      {/* === DELETE MODAL === */}
      {selectedIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Lyric Line
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
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Lyric Line
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <h3 className="text-sm text-gray-900">
              Are you sure you want to delete this lyric line?
            </h3>
            <p className="text-sm text-gray-700">
              You are about to permanently delete:
            </p>

            <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
              <p className="text-sm font-semibold text-gray-900">
                {selectedIndex !== null ? lyrics[selectedIndex].text_en : ""}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {selectedIndex !== null ? lyrics[selectedIndex].text_vi : ""}
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

export default LyricsTable;
