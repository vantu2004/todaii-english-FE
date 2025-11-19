import { createVideo } from "../../../../api/servers/videoApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { logError } from "../../../../utils/LogError";
import VideoForm from "../../../../components/servers/manage_videos_page/VideoForm";
import { useYoutubeDataStore } from "../../../../stores/useYoutubeDataStore";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const CreateVideo = () => {
  const { setHeader } = useHeaderContext();

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
      title: raw.title || "",
      author_name: raw.author_name || "",
      provider_name: raw.provider_name || "",
      provider_url: raw.provider_url || "",
      thumbnail_url: raw.thumbnail_url || "",
      embed_html: raw.embed_html || "",
      video_url: raw.video_url || "",
      cefr_level: raw.cefr_level || "A1",
      topic_ids: [],
    };
  };

  useEffect(() => {
    setHeader({
      title: "Manage Videos",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage Videos", to: "/server/video" },
        { label: "Create Video" },
      ],
    });
  }, []);

  useEffect(() => {
    if (rawVideo) {
      const normalized = normalizeRawVideo(rawVideo);
      setInitialData(normalized);
    }

    return () => clearRawVideo();
  }, [rawVideo, clearRawVideo]);

  return (
    <div className="flex flex-col h-full">
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
