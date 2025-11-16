import { motion } from "framer-motion";
import { ExternalLink, Download } from "lucide-react";

const SearchByUrl = ({ video = {} }) => {
  const exportVideo = (v) => {
    console.log("Export video:", v);
  };

  if (!video.embed_html) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Download className="w-6 h-6 opacity-30" />
          </div>
          <p className="text-gray-400">No video data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: Video Only (2/3) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-2/3 border-r border-gray-200 pr-6 flex items-center justify-center"
        >
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: video.embed_html }}
            />
          </div>
        </motion.div>

        {/* Right: Info (1/3) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-1/3 bg-gradient-to-b from-gray-50/80 to-white/50 px-6 overflow-y-auto flex flex-col"
        >
          {/* Title */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 line-clamp-3">
              {video.title}
            </h2>
            <p className="text-sm text-gray-600 mt-2">{video.provider_name}</p>
          </div>

          <div className="w-full h-px bg-gray-200 mb-4"></div>

          {/* Channel Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-3">
              Channel
            </p>
            <div className="flex items-center gap-3">
              <img
                src={video.thumbnail_url}
                alt={video.author_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {video.author_name}
                </p>
                <p className="text-xs text-gray-600">{video.provider_name}</p>
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
              Provider
            </p>
            <p className="text-sm text-gray-900 font-medium">
              {video.provider_name}
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2 mt-auto">
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4" /> Open Video
            </a>
            <button
              onClick={() => exportVideo(video)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all duration-200 text-sm"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchByUrl;
