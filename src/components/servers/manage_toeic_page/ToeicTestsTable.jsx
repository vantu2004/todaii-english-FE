import { useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import {
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Volume2,
  Eye,
  Info,
  List,
} from "lucide-react";
import { deleteToeicTest } from "@/api/servers/toeicTestApi";
import { logError } from "@/utils/LogError";
import ToeicTestDetails from "./ToeicTestDetails";

const ToeicTestsTable = ({
  columns,
  tests,
  reloadTests,
  query,
  updateQuery,
  onEdit,
  onManageContent,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [metadataIndex, setMetadataIndex] = useState(null);

  const getAudioUrl = (item) =>
    item.audio_request?.uploaded_audio ||
    item.audio_request?.audio_url ||
    item.audio_url ||
    item.audioUrl;
  const getImageUrl = (item) =>
    item.image_request?.uploaded_image ||
    item.image_request?.image_url ||
    item.image_url ||
    item.imageUrl ||
    item.thumbnail;

  const handleMetadataClick = (index) => {
    setMetadataIndex(index);
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

  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex === null) return;
    try {
      const id = tests[selectedIndex].id;
      await deleteToeicTest(id);
      await reloadTests();
      setSelectedIndex(null);
      setIsDeleteModalOpen(false);
      toast.success("Test deleted successfully");
    } catch (err) {
      logError(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
            PUBLISHED
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
            ARCHIVED
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium">
            DRAFT
          </span>
        );
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

          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {tests.map((item, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-semibold">{item.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                <td className="px-4 py-3 text-sm">
                  {item.testType || item.test_type}
                </td>
                <td className="px-4 py-3 text-sm">{item.duration}m</td>
                <td className="px-4 py-3 text-sm">
                  {getAudioUrl(item) ? (
                    <button
                      onClick={() => handlePlayAudio(i, getAudioUrl(item))}
                      disabled={playingIndex === i}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                    >
                      <Volume2 className="w-5 h-5" />
                      {playingIndex === i ? "Playing..." : "Play"}
                    </button>
                  ) : (
                    <span className="text-gray-400 italic text-xs">
                      No audio
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item.collection?.name || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatISODate(item.updatedAt || item.updated_at)}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <button
                      onClick={() => handleMetadataClick(i)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Metadata"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit Test"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onManageContent(item)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Manage Content"
                    >
                      <List className="w-5 h-5" />
                    </button>
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
            {tests.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No tests found.
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
              <div className="p-2 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Delete Test
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
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Test
              </button>
            </div>
          }
        >
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border-2 border-red-200/50">
            <h3 className="font-bold text-gray-900 mb-2 text-lg">
              Are you sure you want to delete this test?
            </h3>
            <div className="bg-white rounded-lg p-3 border border-red-300 mb-4">
              <p className="text-sm font-semibold text-red-700">
                {tests[selectedIndex]?.title}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {metadataIndex !== null && (
        <Modal
          isOpen={true}
          onClose={() => setMetadataIndex(null)}
          width="sm:max-w-5xl"
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <Info className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Test Details
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Detailed information about the test
                </p>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMetadataIndex(null)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
              >
                Close
              </button>
            </div>
          }
        >
          <ToeicTestDetails test={tests[metadataIndex]} />
        </Modal>
      )}
    </>
  );
};

export default ToeicTestsTable;
