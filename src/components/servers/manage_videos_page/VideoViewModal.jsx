import Modal from "@/components/servers/Modal";
import VideoDetails from "./VideoDetails";

const VideoViewModal = ({ isOpen, onClose, video }) => {
  if (!video) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<h2 className="text-lg font-semibold text-gray-900">Video Details</h2>}
      width="sm:max-w-7xl"
    >
      <VideoDetails video={video} />
    </Modal>
  );
};

export default VideoViewModal;
