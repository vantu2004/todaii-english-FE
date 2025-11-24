import VideoPlayer from "../../video/VideoPlayer";
import LyricsPanel from "../../video/LyricsPanel";
import useVideoPlayer from "../../../hooks/useVideoPlayer";

export default function VideoPreview({ video, lyricLines }) {
  const {
    state,
    setState,
    setPlayerRef,
    handleTimeUpdate,
    handleDuration,
    activeLyricIndex,
    lyricRefs,
    seekToMs,
  } = useVideoPlayer(lyricLines);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <VideoPlayer
          videoUrl={video.video_url}
          state={state}
          setPlayerRef={setPlayerRef}
          onPlay={() => setState((s) => ({ ...s, playing: true }))}
          onPause={() => setState((s) => ({ ...s, playing: false }))}
          onEnded={() => setState((s) => ({ ...s, playing: false }))}
          onTimeUpdate={handleTimeUpdate}
          onDuration={handleDuration}
        />
      </div>

      <LyricsPanel
        lyricLines={lyricLines}
        lyricRefs={lyricRefs}
        activeIndex={activeLyricIndex}
        onSeek={seekToMs}
      />
    </div>
  );
}
