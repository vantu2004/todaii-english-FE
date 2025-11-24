import { useState, useRef, useCallback } from "react";

export default function useVideoPlayer(lyricLines = []) {
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
    if (player) playerRef.current = player;
  }, []);

  // Sync lyrics
  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player || state.seeking) return;

    const currentMs = player.currentTime * 1000;

    const index = lyricLines.findIndex((line, i) => {
      const next = lyricLines[i + 1];
      return (
        currentMs >= line.start_ms &&
        (next ? currentMs < next.start_ms : currentMs <= line.end_ms)
      );
    });

    setActiveLyricIndex(index);

    setState((s) => ({
      ...s,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
    }));
  };

  const handleDuration = () => {
    const player = playerRef.current;
    if (!player) return;

    setState((s) => ({ ...s, duration: player.duration }));
  };

  const seekToMs = (ms) => {
    const player = playerRef.current;
    if (!player) return;

    const sec = ms / 1000;
    player.currentTime = sec;

    setState((s) => ({
      ...s,
      playedSeconds: sec,
      played: sec / player.duration,
      playing: true,
    }));
  };

  return {
    state,
    setState,
    playerRef,
    lyricRefs,
    activeLyricIndex,
    setPlayerRef,
    handleTimeUpdate,
    handleDuration,
    seekToMs,
  };
}
