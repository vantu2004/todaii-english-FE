import { X, Clock, User, Eye } from "lucide-react";

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-[#181a20] rounded-xl overflow-hidden shadow-2xl flex flex-col">
        <div className="aspect-video bg-black relative">
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: video.embed_html }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-2">{video.title}</h2>
          <div className="flex gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <User size={14} /> {video.author_name}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {formatNumber(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {formatDate(video.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
