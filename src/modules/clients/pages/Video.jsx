import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Giả sử dùng react-router-dom
import {
  getLatestVideos,
  getTopVideos,
  filterVideos,
} from "../../../api/clients/videoApi"; // Import API của bạn
import HeroSection from "../../../components/clients/video_page/HeroSection";
import TopicSection from "../../../components/clients/video_page/TopicSection";
import VideoSlider from "../../../components/clients/video_page/VideoSlider";
import DateFilterSection from "../../../components/clients/video_page/DateFilterSection";
import { getAllTopics } from "../../../api/clients/topicApi";
import { logError } from "../../../utils/LogError";

const Video = () => {
  const navigate = useNavigate();

  // State quản lý dữ liệu
  const [heroVideo, setHeroVideo] = useState(null);
  const [topics, setTopics] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [dateFilteredVideos, setDateFilteredVideos] = useState([]);

  // State trạng thái loading/error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi song song các API để tiết kiệm thời gian
        const [latestRes, topicRes, topRes] = await Promise.all([
          getLatestVideos(10), // Lấy 10 video mới nhất
          getAllTopics("VIDEO"), // Lấy danh sách topic
          getTopVideos(10), // Lấy 10 video top view
        ]);

        // Xử lý dữ liệu
        // API của bạn trả về response.data, kiểm tra cấu trúc thực tế (thường là .content nếu phân trang)
        const latest = latestRes.content || latestRes || [];
        const top = topRes.content || topRes || [];

        setLatestVideos(latest);
        setTopics(topicRes);
        setTopVideos(top);

        // Chọn video đầu tiên của danh sách mới nhất làm Hero (hoặc logic khác tùy bạn)
        if (latest.length > 0) {
          setHeroVideo(latest[0]);
        }

        // Mặc định tab lọc ngày sẽ hiển thị video mới nhất
        setDateFilteredVideos(latest);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hàm xử lý khi click vào video (Chuyển trang)
  const handleVideoClick = (video) => {
    // Navigate đến trang chi tiết
    navigate(`/video/${video.id}`);
  };

  // Hàm xử lý khi chọn ngày (Gọi API lọc)
  const handleDateFilter = async (dateStr) => {
    try {
      // Giả sử API filterVideos hỗ trợ param 'createdDate' hoặc bạn lọc client.
      // Ở đây tôi gọi filterVideos theo logic API bạn cung cấp.
      // Nếu Backend chưa hỗ trợ lọc theo ngày chính xác, bạn có thể cần update Backend.
      // Tạm thời tôi demo gọi API search keyword rỗng để lấy list, thực tế cần param date.
      const res = await filterVideos({
        page: 1,
        size: 10,
        sortBy: "createdAt",
        direction: "desc",
      });
      // Logic lọc client tạm thời nếu API chưa support date exact match
      const filtered = (res.content || res).filter((v) =>
        v.createdAt.startsWith(dateStr)
      );
      setDateFilteredVideos(
        filtered.length > 0 ? filtered : res.content || res
      ); // Fallback nếu ko có data
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* 1. Hero Section (Full Screen) */}
      {heroVideo && (
        <HeroSection
          video={heroVideo}
          onPlay={() => handleVideoClick(heroVideo)}
        />
      )}

      {/* 2. Topics */}
      <TopicSection topics={topics} />

      {/* 3. Slider: Video Mới Cập Nhật */}
      <VideoSlider
        title="Video Mới Cập Nhật"
        videos={latestVideos}
        onVideoClick={handleVideoClick}
      />

      {/* 4. Slider: Top Lượt Xem */}
      <VideoSlider
        title="Top Lượt Xem"
        videos={topVideos}
        onVideoClick={handleVideoClick}
      />

      {/* 5. Date Filter Section */}
      <DateFilterSection
        videos={dateFilteredVideos}
        onVideoClick={handleVideoClick}
        onDateChange={handleDateFilter} // Truyền hàm xử lý đổi ngày
      />
    </div>
  );
};

export default Video;
