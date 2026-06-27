import {
  Play,
  Clock,
  User,
  MonitorPlay,
  Eye,
  Tag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";
import SearchBar from "@/components/clients/SearchBar";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = ({ videos = [], video, onNavigate }) => {
  const [keyword, setKeyword] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const displayVideos =
    videos && videos.length > 0 ? videos : video ? [video] : [];

  useEffect(() => {
    if (displayVideos.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayVideos.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [displayVideos.length, isHovered]);

  if (displayVideos.length === 0) return null;

  const currentVideo = displayVideos[activeIndex];

  const prevSlide = (e) => {
    e.stopPropagation();
    setActiveIndex(
      (prev) => (prev - 1 + displayVideos.length) % displayVideos.length,
    );
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % displayVideos.length);
  };

  return (
    <section
      className="relative w-full h-screen overflow-hidden group bg-[#0f1014]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image Layer with AnimatePresence */}
      <div className="absolute inset-0 z-0 select-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />

        <AnimatePresence mode="wait">
          <motion.img
            key={currentVideo.id}
            src={currentVideo.thumbnail_url}
            alt={currentVideo.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* --- SEARCH BAR AREA --- */}
      <div className="absolute z-30 top-20 left-4 right-4 md:top-24 md:right-12 md:left-auto md:w-[400px]">
        <SearchBar
          value={keyword}
          placeholder="Tìm kiếm video..."
          onSearch={(text) => {
            setKeyword(text);
            onNavigate(text, null);
          }}
        />
      </div>

      {/* Content Area with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="absolute z-20 bottom-20 left-4 right-4 md:bottom-16 md:left-12 md:right-auto md:max-w-4xl pr-0 md:pr-4"
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {videos && videos.length > 0 && (
              <span className="bg-brand-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-sm border border-brand-400/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles size={12} className="animate-pulse" /> Đề xuất nổi bật
              </span>
            )}
            <span className="bg-yellow-500 text-black text-[11px] font-extrabold px-2.5 py-1 rounded-sm shadow-sm">
              HD
            </span>
            <span className="bg-white/10 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-sm border border-white/20">
              {currentVideo.cefr_level} Level
            </span>
            <span className="text-gray-300 text-[11px] font-medium flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-sm border border-white/10">
              <Clock size={12} /> {formatISODate(currentVideo.created_at)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight mb-4 drop-shadow-lg line-clamp-2 md:line-clamp-none">
            {currentVideo.title}
          </h1>

          {/* Info Grid */}
          <div className="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2 text-xs md:text-sm text-neutral-300 mb-6 md:mb-8 bg-black/30 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/10 shadow-lg max-w-2xl">
            <div className="flex items-center gap-2 font-medium">
              <User size={14} className="text-neutral-300" />
              <span className="truncate max-w-[120px] md:max-w-none">
                {currentVideo.author_name}
              </span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <MonitorPlay size={14} className="text-neutral-300" />
              <span>{currentVideo.provider_name}</span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <Eye size={14} className="text-neutral-300" />
              <span>
                {new Intl.NumberFormat("vi-VN").format(currentVideo.views)} lượt
                xem
              </span>
            </div>
            {/* Topics */}
            {currentVideo.topics && currentVideo.topics.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 w-full pt-2 md:pt-3 border-t border-white/10 mt-1">
                <Tag size={14} className="text-neutral-300" />
                <span className="truncate text-gray-300">
                  {currentVideo.topics.map((t) => t.name).join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 md:gap-4">
            <RouterLink
              to={`/client/video/${currentVideo.id}`}
              className="flex items-center gap-2 bg-white text-neutral-900 hover:bg-neutral-100 px-5 md:px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm md:text-base shadow-sm"
            >
              <Play fill="currentColor" size={18} />
              Xem Ngay
            </RouterLink>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls Overlay (Bottom Right) */}
      {displayVideos.length > 1 && (
        <div className="absolute z-30 bottom-6 right-4 md:bottom-12 md:right-12 flex items-center gap-4 bg-black/45 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-lg">
          <div className="flex gap-1.5">
            {displayVideos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "bg-white w-5"
                    : "bg-white/40 w-1.5 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextSlide}
              className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
