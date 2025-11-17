import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchLyrics, createLyricBatch } from "../../../api/servers/lyricApi";
import LyricToolBar from "../../../components/servers/manage_lyrics_page/LyricToolBar";
import { motion } from "framer-motion";
import { logError } from "../../../utils/LogError";
import { useParams } from "react-router-dom";
import LyricsTable from "../../../components/servers/manage_lyrics_page/LyricsTable";
import { SearchX } from "lucide-react";

const ManageLyrics = () => {
  const { id } = useParams();

  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [query, setQuery] = useState({
    sortBy: "lineOrder",
    direction: "asc",
    keyword: "",
  });

  // columns tuỳ theo design bảng Lyrics
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

  // const handleConfirmCreate = async (data) => {
  //   try {
  //     await createLyricBatch(data);
  //     await reloadLyrics();
  //     setIsCreateModalOpen(false);
  //     toast.success("Lyric created successfully");
  //   } catch (error) {
  //     logError(error);
  //   }
  // };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Lyrics
        </h2>

        <LyricToolBar
          updateQuery={updateQuery}
          setIsUploadModalOpen={setIsUploadModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
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
          <div className="flex flex-col items-center justify-center text-gray-400">
            <SearchX className="w-18 h-18 mt-12 mb-5" />
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

      {/* Modal Tạo mới */}
      {/* {isCreateModalOpen && (
        <LyricFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          mode="create"
          initialData={{}}
          onSubmit={handleConfirmCreate}
        />
      )} */}
    </div>
  );
};

export default ManageLyrics;
