import React from "react";

const ArticleContent = ({ paragraphs }) => {
  // Function to speak all paragraphs sequentially
  const speakParagraphs = () => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser does not support text-to-speech!");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    paragraphs?.forEach((p, index) => {
      const utterance = new SpeechSynthesisUtterance(p.text_en);
      utterance.onstart = () => {
        console.log(`Speaking paragraph ${index + 1}`);
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      {/* Button to read all paragraphs */}
      <div className="mb-4 text-right">
        <button
          onClick={speakParagraphs}
          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          🔊 Nghe bài viết
        </button>
      </div>

      {paragraphs?.map((p) => (
        <p key={p.id} className="text-gray-700 leading-relaxed mb-4">
          {p.text_en}
        </p>
      ))}
    </div>
  );
};

export default ArticleContent;
