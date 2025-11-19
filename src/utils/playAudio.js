export const playAudioWithEvent = async (event, audioUrl) => {
  event.stopPropagation();
  if (audioUrl) {
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (err) {
      console.error(err);
      toast.error("Audio playback failed");
    }
  }
};
