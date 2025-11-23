import { Play } from "lucide-react";

const VideoCard = ({ video, onClick }) => {
  return (
    <div onClick={() => onClick(video)} className="group cursor-pointer w-full">
      <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-800 group-hover:border-gray-600 transition-all">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay Play */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white border border-white/40">
            <Play fill="currentColor" size={16} />
          </div>
        </div>

        {/* Badges on Image */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="bg-gray-900/80 text-white text-[10px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
            Part 1
          </span>
          <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
            {video.cefr_level}
          </span>
        </div>
      </div>

      <div className="mt-2">
        <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
          {video.title}
        </h4>
        <p className="text-gray-500 text-xs mt-1">{video.author_name}</p>
      </div>
    </div>
  );
};

export default VideoCard;
