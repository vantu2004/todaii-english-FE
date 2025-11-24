import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLatestVideos,
  getTopVideos,
  getVideosByDate,
} from "../../../api/clients/videoApi";
import HeroSection from "../../../components/clients/video_page/HeroSection";
import TopicSection from "../../../components/clients/video_page/TopicSection";
import VideoSlider from "../../../components/clients/video_page/VideoSlider";
import DateFilterSection from "../../../components/clients/video_page/DateFilterSection";
import { getAllTopics } from "../../../api/clients/topicApi";
import { logError } from "../../../utils/logError";
import { AnimatePresence, motion } from "framer-motion";

const Video = () => {
  const navigate = useNavigate();

  const [heroVideo, setHeroVideo] = useState(null);
  const [topics, setTopics] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [topVideos, setTopVideos] = useState([]);

  // State cho phần lọc theo ngày
  const [dateFilteredVideos, setDateFilteredVideos] = useState([]);
  const [dateFilterPage, setDateFilterPage] = useState(1);
  const [dateFilterHasMore, setDateFilterHasMore] = useState(false);
  const [currentDateFilter, setCurrentDateFilter] = useState(null);
  const [isDateLoading, setIsDateLoading] = useState(false);

  // State loading trang lần đầu
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [latestRes, topicRes, topRes] = await Promise.all([
          getLatestVideos(10),
          getAllTopics("VIDEO"),
          getTopVideos(10),
        ]);

        const latest = latestRes || [];
        const top = topRes || [];

        setLatestVideos(latest);
        setTopics(topicRes);
        setTopVideos(top);

        // Chọn video đầu tiên làm hero video
        if (latest.length > 0) {
          setHeroVideo(latest[0]);
        }

        // Mặc định lấy video của ngày hôm nay
        handleDateChange(new Date());
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (keyword, alias) => {
    if (keyword) {
      navigate(`/client/video/filter?q=${encodeURIComponent(keyword)}`);
    } else if (alias) {
      navigate(`/client/video/filter?alias=${encodeURIComponent(alias)}`);
    } else {
      navigate(`/client/video/filter`);
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/client/video/${videoId}`);
  };

  // Xử lý khi chọn ngày mới (RESET LIST) ---
  const handleDateChange = async (dateStr) => {
    try {
      setIsDateLoading(true);
      setCurrentDateFilter(dateStr);
      setDateFilterPage(1);

      const res = await getVideosByDate(dateStr, 1, 5, "createdAt", "desc");

      setDateFilteredVideos(res.content || []);
      setDateFilterHasMore(!res.last);
    } catch (err) {
      logError(err);
      setDateFilteredVideos([]);
      setDateFilterHasMore(false);
    } finally {
      setIsDateLoading(false);
    }
  };

  // Xử lý khi bấm "Xem thêm" (APPEND LIST) ---
  const handleLoadMoreDateVideos = async () => {
    if (!currentDateFilter || isDateLoading) return;

    try {
      setIsDateLoading(true);
      const nextPage = dateFilterPage + 1;

      // Gọi API lấy trang tiếp theo
      const res = await getVideosByDate(
        currentDateFilter,
        nextPage,
        5,
        "createdAt",
        "desc"
      );

      setDateFilteredVideos((prev) => [...prev, ...(res.content || [])]);

      setDateFilterPage(nextPage);
      setDateFilterHasMore(!res.last);
    } catch (err) {
      logError(err);
    } finally {
      setIsDateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        key="search-results-page"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-purple-200 selection:text-purple-900"
      >
        {heroVideo && (
          <HeroSection
            video={heroVideo}
            onPlay={() => handleVideoClick(heroVideo.id)}
            onNavigate={handleNavigate}
          />
        )}

        <TopicSection topics={topics} onNavigate={handleNavigate} />

        <VideoSlider
          title="Video Mới Cập Nhật"
          videos={latestVideos}
          onVideoClick={handleVideoClick}
          onNavigate={handleNavigate}
        />

        <VideoSlider
          title="Top Lượt Xem"
          videos={topVideos}
          onVideoClick={handleVideoClick}
          onNavigate={handleNavigate}
        />

        <DateFilterSection
          videos={dateFilteredVideos}
          onVideoClick={handleVideoClick}
          onDateChange={handleDateChange}
          onLoadMore={handleLoadMoreDateVideos}
          hasMore={dateFilterHasMore}
          isLoading={isDateLoading}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Video;
