import React from "react";

const VideoPlayer = ({ video }) => {
  if (!video) return null;

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      {/* Sử dụng dangerouslySetInnerHTML để render iframe từ API */}
      <div
        className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
        dangerouslySetInnerHTML={{ __html: video.embed_html }}
      />
    </div>
  );
};

export default VideoPlayer;
