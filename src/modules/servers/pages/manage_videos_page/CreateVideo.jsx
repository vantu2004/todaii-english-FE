import { createVideo } from "../../../../api/servers/videoApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useYoutubeDataStore } from "../../../../stores/useYoutubeDataStore";
import { logError } from "../../../../utils/LogError";
import VideoForm from "../../../../components/servers/manage_videos_page/VideoForm";

const CreateVideo = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});

  // giống bài báo: raw video lấy từ fetch youtube
  const { rawVideo, clearRawVideo } = useYoutubeDataStore();

  const handleCreateVideo = async (data) => {
    try {
      await createVideo(data);

      navigate("/server/video");
    } catch (error) {
      logError(error);
    }
  };

  const normalizeRawVideo = (raw) => {
    if (!raw) return {};

    return {
      youtube_id: raw.youtubeId || "",
      title: raw.title || "",
      author_name: raw.author || "",
      provider_name: raw.providerName || "",
      thumbnail_url: raw.thumbnailUrl || "",
      views: raw.views || 0,
      lyric: raw.lyric || "",
      vocabulary: raw.vocabulary || "",
      enabled: true,
    };
  };

  useEffect(() => {
    if (rawVideo) {
      const normalized = normalizeRawVideo(rawVideo);
      setInitialData(normalized);
    }

    return () => clearRawVideo();
  }, [rawVideo, clearRawVideo]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Videos
        </h2>
      </div>

      {/* Video Form */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <VideoForm
          mode="create"
          initialData={initialData}
          onSubmit={handleCreateVideo}
        />
      </motion.div>
    </div>
  );
};

export default CreateVideo;
