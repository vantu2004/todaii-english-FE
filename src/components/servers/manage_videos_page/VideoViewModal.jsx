import { Eye } from "lucide-react";
import Modal from "../Modal";
import VideoDetails from "./VideoDetails";

const VideoViewModal = ({ isOpen, onClose, video }) => {
  if (!video) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
            <Eye className="text-blue-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Video Details</h2>
            <p className="text-sm text-gray-500">View video information</p>
          </div>
        </div>
      }
      width="sm:max-w-7xl"
    >
      <VideoDetails video={video} />
    </Modal>
  );
};

export default VideoViewModal;
