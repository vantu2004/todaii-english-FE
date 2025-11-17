import React from "react";

const VideoCard = ({videoURL, title, duration, views}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3">
      <img
        src={videoURL}
        className="w-full rounded-md"
        alt="Video thumbnail"
      />
      <p className="text-sm mt-2 font-medium text-gray-700">
        {title}
      </p>
      <span className="text-xs text-gray-500">{duration} phút • {views} lượt xem</span>
    </div>
  );
};

export default VideoCard;
