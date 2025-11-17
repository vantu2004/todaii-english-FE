import { useRef, useState, useCallback } from "react";
import ReactPlayer from "react-player";
import Modal from "../Modal";
import { Music } from "lucide-react";

const PreviewModal = ({ isOpen, onClose, videoUrl, lyrics = [] }) => {
  const playerRef = useRef(null);
  const lyricRefs = useRef([]);

  const [state, setState] = useState({
    playing: false,
    played: 0,
    duration: 0,
    seeking: false,
    playedSeconds: 0,
  });

  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);

  // Set player ref
  const setPlayerRef = useCallback((player) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  // Handle time update - sync lyrics
  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player || state.seeking) return;

    if (!player.duration) return;

    const currentTimeMs = player.currentTime * 1000;

    // Find active lyric
    const activeIndex = lyrics.findIndex((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return (
        currentTimeMs >= lyric.start_ms &&
        (nextLyric
          ? currentTimeMs < nextLyric.start_ms
          : currentTimeMs <= lyric.end_ms)
      );
    });

    setActiveLyricIndex(activeIndex);

    // Auto scroll
    if (activeIndex !== -1 && lyricRefs.current[activeIndex]) {
      lyricRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    setState((prev) => ({
      ...prev,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
    }));
  };

  // Handle duration change
  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;

    setState((prev) => ({ ...prev, duration: player.duration }));
  };

  // Handle play/pause
  const handlePlay = () => {
    setState((prev) => ({ ...prev, playing: true }));
  };

  const handlePause = () => {
    setState((prev) => ({ ...prev, playing: false }));
  };

  // Handle ended
  const handleEnded = () => {
    setState((prev) => ({ ...prev, playing: false }));
  };

  // Click lyric to seek
  const handleLyricClick = (startMs) => {
    const player = playerRef.current;
    if (!player || !player.duration) return;

    const seekToSeconds = startMs / 1000;
    player.currentTime = seekToSeconds;

    setState((prev) => ({
      ...prev,
      played: seekToSeconds / player.duration,
      playedSeconds: seekToSeconds,
    }));
  };

  // Format time
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = String(date.getUTCSeconds()).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Reset when modal closes
  const handleClose = () => {
    setState({
      playing: false,
      played: 0,
      duration: 0,
      seeking: false,
      playedSeconds: 0,
    });
    setActiveLyricIndex(-1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      width="max-w-7xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <Music className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Video Preview
            </h2>
            <p className="text-xs text-gray-500">
              Video with synchronized lyrics
            </p>
          </div>
        </div>
      }
      footer={
        <button
          onClick={handleClose}
          className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Player */}
        <div className="lg:w-2/3 w-full">
          <div className="bg-black rounded-lg overflow-hidden shadow-lg">
            <div
              className="player-wrapper"
              style={{ position: "relative", paddingTop: "56.25%" }}
            >
              <ReactPlayer
                ref={setPlayerRef}
                className="react-player"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                src={videoUrl}
                playing={state.playing}
                controls={true}
                volume={1}
                muted={false}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
                onDurationChange={handleDurationChange}
              />
            </div>
          </div>
        </div>

        {/* Lyrics Panel */}
        <div className="lg:w-1/3 w-full">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4 h-[450px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Music size={18} className="text-green-600" />
                <h3 className="font-semibold text-gray-800">Lyrics</h3>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {lyrics.length} lines
              </span>
            </div>

            {/* Lyrics List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {lyrics && lyrics.length > 0 ? (
                lyrics.map((lyric, index) => (
                  <div
                    key={lyric.id || index}
                    ref={(el) => (lyricRefs.current[index] = el)}
                    onClick={() => handleLyricClick(lyric.start_ms)}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      activeLyricIndex === index
                        ? "bg-green-50 border-green-500 shadow-md"
                        : "bg-white border-gray-200 hover:border-green-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded flex-shrink-0 ${
                          activeLyricIndex === index
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {lyric.line_order}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium mb-1 ${
                            activeLyricIndex === index
                              ? "text-green-700"
                              : "text-gray-800"
                          }`}
                        >
                          {lyric.text_en}
                        </p>
                        <p
                          className={`text-xs mb-1 ${
                            activeLyricIndex === index
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {lyric.text_vi}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {formatTime(lyric.start_ms)} -{" "}
                          {formatTime(lyric.end_ms)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Music size={40} className="mb-2 opacity-50" />
                  <p className="text-sm">No lyrics available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
