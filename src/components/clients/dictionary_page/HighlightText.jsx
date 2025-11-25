// src/components/dictionary/HighlightText.jsx
import React from "react";

const HighlightText = ({ text, keyword }) => {
  if (!text || !keyword) return <span>{text}</span>;

  // Tạo regex không phân biệt hoa thường
  const parts = text.split(new RegExp(`(${keyword})`, "gi"));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span
            key={i}
            className="text-purple-600 font-bold bg-purple-50 px-1 rounded"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightText;
