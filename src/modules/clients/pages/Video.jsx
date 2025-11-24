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
import { logError } from "../../../utils/LogError";

const Video = () => {
  const navigate = useNavigate();

  // --- 1. State Dữ liệu chung ---
  const [heroVideo, setHeroVideo] = useState(null);
  const [topics, setTopics] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [topVideos, setTopVideos] = useState([]);

  // --- 2. State riêng cho phần Lọc Theo Ngày (Pagination) ---
  const [dateFilteredVideos, setDateFilteredVideos] = useState([]);
  const [dateFilterPage, setDateFilterPage] = useState(1); // Trang hiện tại
  const [dateFilterHasMore, setDateFilterHasMore] = useState(false); // Còn dữ liệu để load không?
  const [currentDateFilter, setCurrentDateFilter] = useState(null); // Ngày đang chọn
  const [isDateLoading, setIsDateLoading] = useState(false); // Loading của nút "Xem thêm"

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

  const handleVideoClick = (video) => {
    navigate(`/client/video/${video.id}`);
  };

  // --- 3. Xử lý khi chọn ngày mới (RESET LIST) ---
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

  // --- 4. Xử lý khi bấm "Xem thêm" (APPEND LIST) ---
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      {heroVideo && (
        <HeroSection
          video={heroVideo}
          onPlay={() => handleVideoClick(heroVideo)}
        />
      )}

      <TopicSection topics={topics} />

      <VideoSlider
        title="Video Mới Cập Nhật"
        videos={latestVideos}
        onVideoClick={handleVideoClick}
      />

      <VideoSlider
        title="Top Lượt Xem"
        videos={topVideos}
        onVideoClick={handleVideoClick}
      />

      <DateFilterSection
        videos={dateFilteredVideos}
        onVideoClick={handleVideoClick}
        onDateChange={handleDateChange}
        onLoadMore={handleLoadMoreDateVideos}
        hasMore={dateFilterHasMore}
        isLoading={isDateLoading}
      />
    </div>
  );
};

export default Video;
