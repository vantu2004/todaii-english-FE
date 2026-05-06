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
            className="text-brand-600 dark:text-brand-400 font-bold bg-brand-50 dark:bg-brand-900/30 px-1 rounded"
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
