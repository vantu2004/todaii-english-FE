import { ArrowLeft } from "lucide-react";

const VideoPlayer = ({ video }) => {
  if (!video) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mb-6">
      <div className="mb-4 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:scale-105 transition-transform duration-200"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Quay lại trang trước</span>
        </button>
      </div>

      {/* aspect-video giữ tỷ lệ 16:9 chuẩn */}
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-900/5">
        <div
          className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: video.embed_html }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
