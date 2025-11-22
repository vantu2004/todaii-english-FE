import React from "react";

const ArticleImage = ({ src, title }) => {
  if (!src) return null;

  return (
    <div className="relative w-full mb-10 group">
      <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-neutral-100 shadow-sm">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      {/* Optional Caption Overlay or Bottom text */}
      {title && (
        <p className="mt-3 text-sm text-neutral-500 text-center italic">
          {title}
        </p>
      )}
    </div>
  );
};

export default ArticleImage;
