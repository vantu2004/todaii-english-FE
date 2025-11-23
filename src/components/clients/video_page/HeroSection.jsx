import React from "react";
import { Play, Clock, User, MonitorPlay, Eye, Tag } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

const HeroSection = ({ video, onPlay }) => {
  if (!video) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden group bg-black">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        {/* Lớp phủ 1: Gradient đen từ dưới lên để làm nổi bật text, giảm opacity để không bị đục */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/40 to-transparent z-10" />

        {/* Lớp phủ 2: Gradient nhẹ từ trái sang để căn lề text trái rõ hơn mà không che mất ảnh bên phải */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />

        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110 opacity-90"
        />
      </div>

      {/* Content - Căn góc trái dưới */}
      <div className="absolute z-20 bottom-16 left-6 md:left-12 max-w-4xl pr-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-5 animate-fade-in-up">
          <span className="bg-yellow-500 text-black text-xs font-extrabold px-2 py-1 rounded shadow-[0_0_10px_rgba(234,179,8,0.5)]">
            HD
          </span>
          <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded border border-white/20">
            {video.cefr_level} Level
          </span>
          <span className="text-gray-300 text-xs font-medium flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-white/10">
            <Clock size={12} /> {formatISODate(video.created_at)}
          </span>
        </div>

        {/* Title - Text trắng nổi bật */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-2xl animate-fade-in-up delay-100">
          {video.title}
        </h1>

        {/* Info Grid - Dark Glassmorphism (Trong suốt tối) */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-200 mb-8 animate-fade-in-up delay-200 bg-black/30 backdrop-blur-sm p-5 rounded-xl border-l-4 border-purple-500 border-y border-r border-white/5 shadow-2xl max-w-2xl">
          <div className="flex items-center gap-2 font-medium">
            <User size={16} className="text-purple-400" />
            <span className="truncate">{video.author_name}</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <MonitorPlay size={16} className="text-purple-400" />
            <span>{video.provider_name}</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Eye size={16} className="text-purple-400" />
            <span>
              {new Intl.NumberFormat("vi-VN").format(video.views)} views
            </span>
          </div>
          {/* Topics */}
          {video.topics && video.topics.length > 0 && (
            <div className="flex items-center gap-2 w-full pt-3 border-t border-white/10 mt-1">
              <Tag size={16} className="text-purple-400" />
              <span className="truncate text-gray-300">
                {video.topics.map((t) => t.name).join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 animate-fade-in-up delay-300">
          <button
            onClick={() => onPlay(video)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.5)] active:scale-95 border border-purple-500"
          >
            <Play fill="currentColor" size={20} />
            Xem Ngay
          </button>

          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-bold backdrop-blur-md border border-white/20 transition-all active:scale-95">
            Chi tiết
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
