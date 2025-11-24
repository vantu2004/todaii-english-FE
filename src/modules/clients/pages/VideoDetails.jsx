import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../../../components/clients/video_details_page/VideoPlayer";
import VideoInfo from "../../../components/clients/video_details_page/VideoInfo";
import RelatedVideos from "../../../components/clients/video_details_page/RelatedVideos";
import LyricsPanel from "../../../components/clients/video_details_page/LyricsPanel";
import {
  getVideoById,
  getRelatedVideos,
  getEntriesByVideoId,
} from "../../../api/clients/videoApi";
import { logError } from "../../../utils/logError";
import EntryWordList from "../../../components/clients/EntryWordList";
import { motion, AnimatePresence } from "framer-motion";
import PageNotFound from "../../../pages/PageNotFound";

const VideoDetails = () => {
  const { id } = useParams();

  const [videoData, setVideoData] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("related"); // 'related' hoặc 'lyrics'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [videoRes, relatedRes] = await Promise.all([
          getVideoById(id),
          getRelatedVideos(id),
        ]);

        setVideoData(videoRes);
        setRelatedVideos(relatedRes || []);
      } catch (error) {
        logError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!videoData) return <PageNotFound />;

  return (
    <AnimatePresence>
      <motion.div
        key="search-results-page"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 text-gray-900 font-sans px-4 pt-24 pb-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* --- CỘT TRÁI: VIDEO & INFO (Chiếm 2/3) --- */}
            <div className="lg:col-span-2">
              <VideoPlayer video={videoData} />
              <VideoInfo video={videoData} />
              <EntryWordList id={videoData.id} fetchApi={getEntriesByVideoId} />
            </div>

            {/* --- CỘT PHẢI: SIDEBAR (Chiếm 1/3) --- */}
            <div className="lg:col-span-1">
              {/* Tabs Chuyển đổi: Video liên quan / Lyric */}
              <div className="flex items-center gap-2 mb-4 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                <button
                  onClick={() => setActiveTab("related")}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    activeTab === "related"
                      ? "bg-gray-100 text-gray-900 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Tiếp theo
                </button>
                <button
                  onClick={() => setActiveTab("lyrics")}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    activeTab === "lyrics"
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Lyrics
                </button>
              </div>

              {/* Content Sidebar */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm min-h-[400px]">
                {activeTab === "related" ? (
                  <RelatedVideos videos={relatedVideos} />
                ) : (
                  <LyricsPanel videoId={videoData.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoDetails;
