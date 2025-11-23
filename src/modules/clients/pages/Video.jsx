import { useState } from "react";
import HeroSection from "../../../components/clients/video_page/HeroSection";
import TopicSection from "../../../components/clients/video_page/TopicSection";
import VideoSlider from "../../../components/clients/video_page/VideoSlider";
import DateFilterSection from "../../../components/clients/video_page/DateFilterSection";
import VideoModal from "../../../components/clients/video_page/VideoModal";

// --- DỮ LIỆU MẪU (MOCK DATA) ---
const TOPICS = [
  { id: 1, name: "Marvel", color: "from-blue-700 to-blue-500" },
  { id: 2, name: "4K", color: "from-purple-700 to-purple-500" },
  { id: 3, name: "Sitcom", color: "from-teal-700 to-teal-500" },
  {
    id: 4,
    name: "Lồng Tiếng Cực Mạnh",
    color: "from-indigo-600 to-purple-600",
  },
  { id: 5, name: "Xuyên Không", color: "from-orange-600 to-orange-400" },
  { id: 6, name: "Cổ Trang", color: "from-red-700 to-red-500" },
  { id: 7, name: "+4 chủ đề", color: "from-gray-700 to-gray-600" },
];

const BASE_VIDEO = {
  id: 61,
  title: "A1 English Listening Practice - Cooking",
  author_name: "Listening Time",
  provider_name: "YouTube",
  provider_url: "https://www.youtube.com/",
  thumbnail_url: "https://i.ytimg.com/vi/uVGV8LG3HHM/hqdefault.jpg",
  embed_html:
    '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/uVGV8LG3HHM?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  video_url: "https://www.youtube.com/watch?v=uVGV8LG3HHM",
  views: 12500,
  cefr_level: "A1",
  created_at: "2025-11-18T04:23:14.184967",
  topics: [
    { id: 36, name: "English for Kids" },
    { id: 37, name: "Cooking" },
  ],
};

// Tạo danh sách video giả lập (10 items)
const MOCK_VIDEOS = Array.from({ length: 10 }).map((_, i) => ({
  ...BASE_VIDEO,
  id: i,
  title:
    i % 2 === 0
      ? "A1 English Listening Practice - Cooking Masterclass"
      : "Daily Conversation in Real Life",
  thumbnail_url:
    i % 2 === 0
      ? "https://i.ytimg.com/vi/uVGV8LG3HHM/hqdefault.jpg"
      : "https://img.youtube.com/vi/jfKfPfyJRdk/maxresdefault.jpg", // Ảnh placeholder khác
  views: 1000 + i * 500,
  created_at: "2025-11-23T04:23:14",
}));

// --- MAIN APP COMPONENT ---
const Video = () => {
  const [playingVideo, setPlayingVideo] = useState(null);

  return (
    <div className="min-h-screen bg-[#0f1014] text-gray-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* 1. Hero Full Screen */}
      <HeroSection video={BASE_VIDEO} onPlay={setPlayingVideo} />

      {/* 2. Topics (Pushed down) */}
      <TopicSection topics={TOPICS} />

      {/* 3. Slider Video Mới Cập Nhật */}
      <VideoSlider
        title="Video Mới Cập Nhật"
        videos={MOCK_VIDEOS}
        onVideoClick={setPlayingVideo}
      />

      {/* 4. Slider Top Lượt Xem */}
      <VideoSlider
        title="Top Lượt Xem"
        videos={[...MOCK_VIDEOS].reverse()}
        onVideoClick={setPlayingVideo}
      />

      {/* 5. Date Filter */}
      <DateFilterSection videos={MOCK_VIDEOS} onVideoClick={setPlayingVideo} />

      {/* Player Modal */}
      <VideoModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
    </div>
  );
};

export default Video;
