import { Play, Clock, User, Eye, Tag, MonitorPlay } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

const HeroSection = ({ video, onPlay }) => {
  if (!video) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden group">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014]/90 via-[#0f1014]/30 to-transparent z-10" />
        <img
          src={video.thumbnail_url}
          alt="Hero"
          className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
        />
      </div>

      {/* Content - Căn góc trái dưới */}
      <div className="absolute z-20 bottom-16 left-6 md:left-12 max-w-3xl pr-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in-up">
          <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            HD
          </span>
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded border border-white/20">
            {video.cefr_level} Level
          </span>
          <span className="text-gray-300 text-xs flex items-center gap-1">
            <Clock size={12} /> {formatISODate(video.created_at)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-xl animate-fade-in-up delay-100">
          {video.title}
        </h1>

        {/* Info Grid */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-300 mb-8 animate-fade-in-up delay-200 bg-black/40 backdrop-blur-sm p-4 rounded-lg border-l-4 border-purple-500 max-w-xl">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <User size={14} className="text-purple-400" /> {video.author_name}
          </div>
          <div className="flex items-center gap-2">
            <MonitorPlay size={14} className="text-purple-400" />{" "}
            {video.provider_name}
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-purple-400" /> {video.views} views
          </div>
          <div className="flex items-center gap-2 w-full mt-1">
            <Tag size={14} className="text-purple-400" />
            <span className="truncate">
              {video.topics.map((t) => t.name).join(", ")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 animate-fade-in-up delay-300">
          <button
            onClick={() => onPlay(video)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-purple-600/30"
          >
            <Play fill="currentColor" size={20} />
            Xem Ngay
          </button>
          <button className="flex items-center gap-2 bg-gray-800/80 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-bold backdrop-blur-md border border-gray-600 transition-colors">
            Chi tiết
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
