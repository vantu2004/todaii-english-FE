import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchLyrics,
  uploadSrtFile,
  createLyricBatch,
  createLyric,
  deleteAllLyrics,
} from "../../../api/servers/lyricApi";
import LyricToolBar from "../../../components/servers/manage_lyrics_page/LyricToolBar";
import { motion } from "framer-motion";
import { logError } from "../../../utils/LogError";
import { useParams } from "react-router-dom";
import LyricsTable from "../../../components/servers/manage_lyrics_page/LyricsTable";
import { SearchX } from "lucide-react";
import LyricFormModal from "../../../components/servers/manage_lyrics_page/LyricFormModal";
import UploadSrtFileModal from "../../../components/servers/manage_lyrics_page/UploadSrtFileModal";
import DeleteAllLyricsModal from "../../../components/servers/manage_lyrics_page/DeleteAllLyricsModal";
import PreviewModal from "../../../components/servers/manage_lyrics_page/PreviewModal";
import { fetchVideo } from "../../../api/servers/videoApi";

const ManageLyrics = () => {
  const { id } = useParams();

  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");

  const [query, setQuery] = useState({
    sortBy: "lineOrder",
    direction: "asc",
    keyword: "",
  });

  const columns = [
    { key: "id", label: "ID", sortField: "id" },
    { key: "line_order", label: "Line Order", sortField: "lineOrder" },
    { key: "start_ms", label: "Start(ms)", sortField: "startMs" },
    { key: "end_ms", label: "End(ms)", sortField: "endMs" },
    { key: "text_en", label: "English", sortField: "textEn" },
    { key: "text_vi", label: "Vietnamese", sortField: "textVi" },
    { key: "actions", label: "Actions" },
  ];

  const reloadLyrics = async () => {
    try {
      setLoading(true);

      const data = await fetchLyrics(
        id,
        query.sortBy,
        query.direction,
        query.keyword
      );

      setLyrics(data || []);
    } catch (err) {
      logError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadLyrics();
  }, [query]);

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleFetchVideo = async () => {
    try {
      const response = await fetchVideo(id);
      return response;
    } catch (error) {
      logError(error);
    }
  };

  // custom hàm open preview modal thay vì dùng trực tiếp setIsPreviewModalOpen(true)
  const openPreviewModal = async () => {
    try {
      const video = await handleFetchVideo();
      setVideoUrl(video?.video_url || "");

      setIsPreviewModalOpen(true);
    } catch (err) {
      logError(err);
    }
  };

  const handleUploadSrtFile = async (file) => {
    try {
      const response = await uploadSrtFile(file);
      return response;
    } catch (error) {
      logError(error);
    }
  };

  const handleCreateLyricBatch = async (data) => {
    try {
      await createLyricBatch(id, data);
      await reloadLyrics();

      setIsUploadModalOpen(false);

      toast.success("Lyrics created successfully");
    } catch (error) {
      logError(error);
    }
  };

  const handleCreateLyric = async (lyric) => {
    try {
      await createLyric(id, lyric);
      await reloadLyrics();

      setIsCreateModalOpen(false);

      toast.success("Lyric created successfully");
    } catch (error) {
      logError(error);
    }
  };

  const handleDeleteAllLyrics = async () => {
    try {
      await deleteAllLyrics(id);
      await reloadLyrics();

      setIsDeleteAllModalOpen(false);

      toast.success("Lyrics deleted successfully");
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Lyrics
        </h2>

        <LyricToolBar
          updateQuery={updateQuery}
          setIsPreviewModalOpen={openPreviewModal}
          setIsUploadModalOpen={setIsUploadModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          setIsDeleteAllModalOpen={setIsDeleteAllModalOpen}
        />

        <h4 className="mt-6 mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Lyrics Table
        </h4>
      </div>

      {/* Table Scroll */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        {lyrics.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-400">
            <SearchX className="w-18 h-18 mb-5" />
            <p className="text-lg font-medium">No lyrics found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try uploading or creating new lyrics
            </p>
          </div>
        ) : (
          <LyricsTable
            columns={columns}
            lyrics={lyrics}
            reloadLyrics={reloadLyrics}
            query={query}
            updateQuery={updateQuery}
          />
        )}
      </motion.div>

      {/* Preview */}
      {isPreviewModalOpen && (
        <PreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          videoUrl={videoUrl}
          lyrics={lyrics}
        />
      )}

      {/* Upload file */}
      {isUploadModalOpen && (
        <UploadSrtFileModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUploadSrtFile}
          onCreateBatch={handleCreateLyricBatch}
        />
      )}

      {/* Create */}
      {isCreateModalOpen && (
        <LyricFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
          initialData={{}}
          onSubmit={handleCreateLyric}
        />
      )}

      {/* Delete all */}
      {isDeleteAllModalOpen && (
        <DeleteAllLyricsModal
          isOpen={isDeleteAllModalOpen}
          onClose={() => setIsDeleteAllModalOpen(false)}
          onConfirm={handleDeleteAllLyrics}
        />
      )}
    </div>
  );
};

export default ManageLyrics;
