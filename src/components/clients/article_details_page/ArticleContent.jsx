import React, { useState, useRef, useEffect } from "react";

const ArticleContent = ({ paragraphs }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const currentWordIndexRef = useRef(0);
  const [, forceRender] = useState(0); // to trigger minimal updates
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakParagraphs = (startIndex = 0) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setCurrentParagraph(startIndex);
    currentWordIndexRef.current = 0;

    const speakNext = (index) => {
      if (index >= paragraphs.length) {
        setIsSpeaking(false);
        return;
      }

      const p = paragraphs[index];
      const utterance = new SpeechSynthesisUtterance(p.text_en);
      utteranceRef.current = utterance;

      utterance.onstart = () => {
        setCurrentParagraph(index);
        currentWordIndexRef.current = 0;
        forceRender((r) => r + 1);
      };

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          // Calculate word index from character position
          // This gives us the index of the word that is STARTING
          let textUpToChar = p.text_en.slice(0, event.charIndex).trim();
          let wordIndex = textUpToChar ? textUpToChar.split(/\s+/).length : 0;

          currentWordIndexRef.current = wordIndex;
          forceRender((r) => r + 1); // minimal render for highlight
        }
      };

      utterance.onend = () => speakNext(index + 1);

      window.speechSynthesis.speak(utterance);
    };

    speakNext(startIndex);
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentParagraph(0);
    currentWordIndexRef.current = 0;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      {/* Control buttons */}
      <div className="mb-4 flex gap-2 justify-end">
        {!isSpeaking ? (
          <button
            onClick={() => speakParagraphs(currentParagraph)}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            🔊 Play
          </button>
        ) : (
          <button
            onClick={pauseSpeech}
            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          >
            ⏸ Pause
          </button>
        )}
        <button
          onClick={resumeSpeech}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          ▶ Resume
        </button>
        <button
          onClick={stopSpeech}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          ⏹ Stop
        </button>
      </div>

      {/* Display paragraphs with word highlight */}
      {paragraphs?.map((p, index) => {
        const isCurrent = index === currentParagraph;
        const paragraphBg = isCurrent ? "bg-yellow-50" : "bg-white";

        if (isCurrent) {
          const words = p.text_en.split(/\s+/);
          return (
            <p
              key={p.id}
              className={`text-gray-700 leading-relaxed mb-4 p-2 rounded transition-colors duration-300 ${paragraphBg}`}
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  className={
                    i === currentWordIndexRef.current ? "bg-yellow-200" : ""
                  }
                >
                  {word}{" "}
                </span>
              ))}
            </p>
          );
        } else {
          return (
            <p
              key={p.id}
              className={`text-gray-700 leading-relaxed mb-4 p-2 rounded transition-colors duration-300 ${paragraphBg}`}
            >
              {p.text_en}
            </p>
          );
        }
      })}

      {/* Timestamp */}
      <div className="text-sm text-gray-500 mt-2">
        {paragraphs && paragraphs[currentParagraph]
          ? `Reading paragraph ${currentParagraph + 1} of ${
              paragraphs.length
            }, word ${currentWordIndexRef.current + 1}`
          : "Not speaking"}
      </div>
    </div>
  );
};

export default ArticleContent;
