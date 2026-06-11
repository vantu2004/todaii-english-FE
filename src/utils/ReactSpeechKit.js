import { playAudio } from "./PlayAudio";

let voices = [];

export const loadVoices = () => {
  const setVoices = () => {
    voices = window.speechSynthesis.getVoices();
  };

  setVoices();

  window.speechSynthesis.onvoiceschanged = setVoices;
};

const getBestVoice = () => {
  const preferredVoices = [
    "Microsoft Aria",
    "Microsoft Davis",
    "Microsoft Guy",
    "Microsoft Jenny",
    "Google US English",
    "Google UK English Female",
  ];

  for (const name of preferredVoices) {
    const found = voices.find(
      (v) =>
        v.name.includes(name) && !v.name.toLowerCase().includes("multilingual"),
    );

    if (found) return found;
  }

  return (
    voices.find(
      (v) =>
        (v.lang === "en-US" || v.lang.startsWith("en")) &&
        !v.name.toLowerCase().includes("multilingual"),
    ) || voices[0]
  );
};

const speakText = (text) => {
  if (!window.speechSynthesis) return;

  const synth = window.speechSynthesis;

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = getBestVoice();

  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  synth.speak(utterance);
};

export const handleSpeak = (text, audio) => {
  if (audio) {
    playAudio(audio);
    return;
  }

  speakText(text);
};
