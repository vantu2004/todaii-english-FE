import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import VideoInfo from "../../../components/clients/video_details_page/VideoInfo";
import RelatedVideos from "../../../components/clients/video_details_page/RelatedVideos";
import {
  getVideoById,
  getRelatedVideos,
  getEntriesByVideoId,
} from "../../../api/clients/videoApi";
import { logError } from "../../../utils/LogError";
import EntryWordList from "../../../components/clients/EntryWordList";
import { motion, AnimatePresence } from "framer-motion";
import PageNotFound from "../../../pages/PageNotFound";
import { getVideoLyrics } from "../../../api/clients/videoLyricApi";
import useVideoPlayer from "../../../hooks/useVideoPlayer";
import VideoPlayer from "../../../components/video/VideoPlayer";
import LyricsPanel from "../../../components/video/LyricsPanel";

const VideoDetails = () => {
  const { id } = useParams();

  const [videoData, setVideoData] = useState(null);
  const [lyrics, setLyrics] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    state,
    setState,
    setPlayerRef,
    handleTimeUpdate,
    handleDuration,
    activeLyricIndex,
    lyricRefs,
    seekToMs,
  } = useVideoPlayer(lyrics);

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

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        setLoading(true);

        const data = await getVideoLyrics(id);

        setLyrics(data || []);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
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
        key="dictionary-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gray-50 text-gray-900 font-sans px-4 pt-24 pb-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* --- CỘT TRÁI: VIDEO & INFO (Chiếm 2/3) --- */}
            <div className="lg:col-span-2">
              <VideoPlayer
                videoUrl={videoData.video_url}
                state={state}
                setPlayerRef={setPlayerRef}
                onPlay={() => setState((s) => ({ ...s, playing: true }))}
                onPause={() => setState((s) => ({ ...s, playing: false }))}
                onEnded={() => setState((s) => ({ ...s, playing: false }))}
                onTimeUpdate={handleTimeUpdate}
                onDuration={handleDuration}
              />

              <VideoInfo video={videoData} />

              <EntryWordList id={videoData.id} fetchApi={getEntriesByVideoId} />
            </div>

            {/* --- CỘT PHẢI: SIDEBAR (Chiếm 1/3) --- */}
            <div className="lg:col-span-1">
              <LyricsPanel
                lyricLines={lyrics}
                lyricRefs={lyricRefs}
                activeIndex={activeLyricIndex}
                onSeek={seekToMs}
              />

              <RelatedVideos videos={relatedVideos} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoDetails;
