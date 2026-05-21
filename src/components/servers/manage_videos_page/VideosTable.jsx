import { useEffect, useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  BookA,
  FileText,
} from "lucide-react";
import { toggleVideo, deleteVideo } from "@/api/servers/videoApi";
import { useNavigate } from "react-router-dom";
import { logError } from "@/utils/LogError";
import VideoViewModal from "./VideoViewModal";

const VideosTable = ({ columns, videos, reloadVideos, query, updateQuery }) => {
  const [statusStates, setStatusStates] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setStatusStates(videos.map((v) => v.enabled ?? true));
  }, [videos]);

  const handleToggle = async (index) => {
    setStatusStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const videoId = videos[index].id;

      await toggleVideo(videoId);
      await reloadVideos();
    } catch (error) {
      logError(error);
    }
  };

  const handleVocabClick = (index) => {
    const videoId = videos[index].id;
    navigate(`/server/video/${videoId}/vocab`);
  };

  const handleLyricClick = (index) => {
    const videoId = videos[index].id;
    navigate(`/server/video/${videoId}/lyric`);
  };

  const handleVocabularyClick = (index) => {
    const videoId = videos[index].id;
    navigate(`/server/video/${videoId}/vocabulary`);
  };

  const handleViewClick = (index) => {
    setSelectedVideo(videos[index]);
    setIsViewModalOpen(true);
  };

  const handleUpdateClick = (index) => {
    const videoId = videos[index].id;
    navigate(`/server/video/${videoId}/update`);
  };

  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex === null) return;

    try {
      const videoId = videos[selectedIndex].id;

      await deleteVideo(videoId);
      await reloadVideos();

      setSelectedIndex(null);
      setIsDeleteModalOpen(false);

      toast.success("Video deleted");
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full table-auto">
          {/* Header */}
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;
                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-gray-700 transition-colors"
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

          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {videos.map((v, i) => (
              <tr key={v.id || i} className="text-gray-700">
                <td className="px-4 py-3 text-sm">{v.id}</td>

                <td className="px-4 py-3 text-sm">
                  <a
                    href={v.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 hover:underline line-clamp-2"
                    title={v.title}
                  >
                    {v.title}
                  </a>
                </td>

                <td className="px-4 py-3 text-sm">{v.author_name}</td>

                <td className="px-4 py-3 text-sm">{v.provider_name}</td>

                <td className="px-4 py-3 text-sm">{v.views}</td>

                <td className="px-4 py-3 text-sm">
                  {formatISODate(v.updated_at)}
                </td>

                {/* Lyrics */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleLyricClick(i)}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </td>

                {/* Vocabulary */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleVocabClick(i)}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                  >
                    <BookA className="w-4 h-4" />
                  </button>
                </td>

                {/* Enable toggle */}
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

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm space-x-4">
                    <button
                      onClick={() => handleViewClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleUpdateClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
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
      {selectedVideo && (
        <VideoViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          video={selectedVideo}
        />
      )}

      {/* Delete Modal */}
      {selectedIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Video
            </h2>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Video
              </button>
            </div>
          }
        >
          <div className="space-y-4 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm text-gray-900">
              Are you sure you want to delete this video?
            </h3>
            <p className="text-sm text-gray-700">
              You are about to permanently delete:
            </p>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {selectedIndex !== null ? videos[selectedIndex].title : ""}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {selectedIndex !== null
                  ? videos[selectedIndex].author_name
                  : ""}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              This action is permanent and cannot be reversed.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default VideosTable;
