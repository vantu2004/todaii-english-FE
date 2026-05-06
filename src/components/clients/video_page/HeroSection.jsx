import { Play, Clock, User, MonitorPlay, Eye, Tag, Link } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";
import SearchBar from "../SearchBar"; // Nhớ import
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const HeroSection = ({ video, onNavigate }) => {
  const [keyword, setKeyword] = useState("");

  if (!video) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden group bg-black">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
        <img
          src={video.thumbnail_url} // Đã sửa thành camelCase để khớp Entity Java
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110 opacity-90"
        />
      </div>

      {/* --- SEARCH BAR AREA (Đã tùy chỉnh Responsive) --- */}
      <div className="absolute z-30 top-20 left-4 right-4 md:top-24 md:right-12 md:left-auto md:w-[400px]">
        <SearchBar
          value={keyword}
          placeholder="Tìm kiếm bài viết..."
          onSearch={(text) => {
            setKeyword(text);
            onNavigate(text, null);
          }}
        />
      </div>

      {/* Content - Căn góc trái dưới */}
      <div className="absolute z-20 bottom-20 left-4 right-4 md:bottom-16 md:left-12 md:right-auto md:max-w-4xl pr-0 md:pr-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in-up">
          <span className="bg-yellow-500 text-black text-xs font-extrabold px-2 py-1 rounded shadow-sm">
            HD
          </span>
          <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded border border-white/20">
            {video.cefr_level} Level
          </span>
          <span className="text-gray-300 text-xs font-medium flex items-center gap-1 bg-black/40 px-2 py-1 rounded border border-white/10">
            <Clock size={12} /> {formatISODate(video.created_at)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight mb-4 drop-shadow-lg animate-fade-in-up delay-100 line-clamp-2 md:line-clamp-none">
          {video.title}
        </h1>

        {/* Info Grid */}
        {/* Trên mobile (màn hình nhỏ) có thể ẩn bớt grid thông tin để đỡ rối, hoặc giữ lại tùy bạn. Ở đây tôi giữ lại nhưng cho flex-wrap */}
        <div className="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2 text-xs md:text-sm text-neutral-300 mb-6 md:mb-8 animate-fade-in-up delay-200 bg-black/30 backdrop-blur-md p-3 md:p-5 rounded-2xl border border-white/10 shadow-lg max-w-2xl">
          <div className="flex items-center gap-2 font-medium">
            <User size={14} className="text-neutral-300" />
            <span className="truncate max-w-[100px] md:max-w-none">
              {video.author_name}
            </span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <MonitorPlay size={14} className="text-neutral-300" />
            <span>{video.provider_name}</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <Eye size={14} className="text-neutral-300" />
            <span>
              {new Intl.NumberFormat("vi-VN").format(video.views)} views
            </span>
          </div>
          {/* Topics - Ẩn trên mobile rất nhỏ nếu cần thiết, hoặc giữ nguyên */}
          {video.topics && video.topics.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 w-full pt-2 md:pt-3 border-t border-white/10 mt-1">
              <Tag size={14} className="text-neutral-300" />
              <span className="truncate text-gray-300">
                {video.topics.map((t) => t.name).join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 md:gap-4 animate-fade-in-up delay-300">
          <RouterLink
            to={`/client/video/${video.id}`}
            className="flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-100 px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-semibold transition-all shadow-md active:scale-95 text-sm md:text-base"
          >
            <Play fill="currentColor" size={18} />
            Xem Ngay
          </RouterLink>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
