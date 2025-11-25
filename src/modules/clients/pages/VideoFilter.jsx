import { useState, useEffect } from "react";
import { ChevronDown, LayoutGrid, ArrowLeft } from "lucide-react";
import SearchBar from "../../../components/clients/SearchBar";
import Pagination from "../../../components/clients/Pagination";
import { filterVideos } from "../../../api/clients/videoApi";
import { getAllTopics } from "../../../api/clients/topicApi";
import { logError } from "../../../utils/LogError";
import VideoFilterSidebar from "../../../components/clients/video_filter_page/VideoFilterSidebar";
import VideoCard from "../../../components/clients/video_page/VideoCard";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const SORT_OPTIONS = [
  { label: "Mới nhất", value: "createdAt-desc" },
  { label: "Cũ nhất", value: "createdAt-asc" },
  { label: "Xem nhiều nhất", value: "views-desc" },
  { label: "Xem ít nhất", value: "views-asc" },
];

const VideoFilter = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const alias = searchParams.get("alias") || "";
  const cefrLevel = searchParams.get("cefr_level") || "";

  const [videos, setVideos] = useState([]);
  const [topics, setTopics] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 0, totalElements: 0 });

  const navigate = useNavigate();

  const [query, setQuery] = useState({
    keyword: q || "",
    cefrLevel: cefrLevel || "",
    minViews: 0,
    alias: alias || "",
    page: 1,
    size: 9,
    sortBy: "createdAt",
    direction: "desc",
  });

  // fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await getAllTopics("VIDEO");
        setTopics(res || []);
      } catch (err) {
        logError(err);
      }
    };

    fetchTopics();
  }, []);

  // fetch videos on query change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await filterVideos(query);
        if (res) {
          setVideos(res.content);
          setMeta({
            totalPages: res.total_pages,
            totalElements: res.total_elements,
          });
        }
      } catch (err) {
        logError(err);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSortChange = (e) => {
    const [sortBy, direction] = e.target.value.split("-");
    setQuery((prev) => ({ ...prev, sortBy, direction, page: 1 }));
  };

  const updateQuery = (newValues) => {
    setQuery((prev) => ({ ...prev, ...newValues }));
  };

  const handleVideoClick = (videoId) => {
    navigate(`/client/video/${videoId}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="search-results-page"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-neutral-50/50 pt-24 pb-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* --- HEADER SECTION (Redesigned) --- */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => window.history.back()}
                className="group p-2.5 bg-white border border-neutral-200 rounded-full text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>

              <div>
                <h1 className="text-3xl font-light text-neutral-900 tracking-tight">
                  Thư viện Video
                </h1>
                {/* Optional: Breadcrumb nhỏ hoặc subtitle nếu cần */}
                {/* <p className="text-xs text-neutral-400">Khám phá thế giới qua video</p> */}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div className="flex-1 max-w-2xl">
                <SearchBar
                  value={query.keyword}
                  placeholder="Tìm kiếm video theo tiêu đề, tác giả..."
                  onChangeSearch={(val) =>
                    updateQuery({ keyword: val, page: 1 })
                  }
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 justify-end">
                <span className="text-sm text-neutral-500 font-medium hidden sm:block">
                  Sắp xếp:
                </span>
                <div className="relative w-full sm:w-auto">
                  <select
                    className="w-full sm:w-48 appearance-none bg-white border border-neutral-200 text-neutral-700 py-3 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 hover:border-neutral-300 transition-all cursor-pointer shadow-sm"
                    onChange={handleSortChange}
                    value={`${query.sortBy}-${query.direction}`}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* --- LEFT SIDEBAR (Component đã tách) --- */}
            <VideoFilterSidebar
              query={query}
              updateQuery={updateQuery}
              topics={topics}
            />

            {/* --- RIGHT CONTENT (VIDEO GRID) --- */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-neutral-500">
                  Hiển thị{" "}
                  <span className="font-bold text-neutral-900">
                    {meta.totalElements}
                  </span>{" "}
                  video phù hợp
                </p>
              </div>

              {videos.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        onClick={() => handleVideoClick(video.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={query.page}
                      totalPages={meta.totalPages}
                      onPageChange={(p) => {
                        // Cuộn lên đầu khi chuyển trang
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        updateQuery({ page: p });
                      }}
                    />
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="bg-white rounded-3xl p-16 text-center border border-neutral-100">
                  <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LayoutGrid size={32} className="text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    Không tìm thấy video
                  </h3>
                  <p className="text-neutral-500 text-sm mt-2">
                    Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.
                  </p>
                  <button
                    onClick={() =>
                      updateQuery({
                        keyword: "",
                        cefrLevel: "",
                        alias: "",
                        minViews: 0,
                        page: 1,
                      })
                    }
                    className="mt-6 px-6 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoFilter;
