import toast from "react-hot-toast";
import { fetchVideo, updateVideo } from "../../../../api/servers/videoApi";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import VideoForm from "../../../../components/servers/manage_videos_page/VideoForm";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";

const UpdateVideo = () => {
  const { setHeader } = useHeaderContext();

  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setHeader({
      title: "Manage Video",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage Videos", to: "/server/video" },
        { label: "Update Video" },
      ],
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchVideo(id);
        setVideo(data);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdateVideo = async (formData) => {
    try {
      await updateVideo(id, formData);
      toast.success("Video updated!");

      navigate("/server/video");
    } catch (error) {
      logError(error);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (!video) {
    return (
      <div className="p-8 text-red-500">
        Cannot load video. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <VideoForm
          mode="update"
          initialData={video}
          onSubmit={handleUpdateVideo}
        />
      </motion.div>
    </div>
  );
};

export default UpdateVideo;
