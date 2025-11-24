import ReactPlayer from "react-player";
import { ArrowLeft } from "lucide-react";

export default function VideoPlayer({
  videoUrl,
  state,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onDuration,
  setPlayerRef,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:scale-105 transition-transform duration-200 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Quay lại</span>
      </button>

      {/* Container bọc ngoài tạo hiệu ứng nổi khối */}
      <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-900/5 group">
        <ReactPlayer
          ref={setPlayerRef}
          className="react-player absolute top-0 left-0"
          width="100%"
          height="100%"
          src={videoUrl}
          playing={state.playing}
          controls={true}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
          onDuration={onDuration}
          config={{
            youtube: { playerVars: { showinfo: 1 } },
          }}
        />

        {/* (Optional) Lớp phủ gradient mờ khi pause để video trông đẹp hơn nếu cần */}
        {!state.playing && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
      </div>
    </div>
  );
}
