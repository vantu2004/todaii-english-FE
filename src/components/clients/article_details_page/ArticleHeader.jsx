import { Clock, Eye, Globe } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import { useState } from "react";

const ArticleHeader = ({ data, formatDate }) => {


  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 relative">
      {/* BOOKMARK BUTTON FIXED */}
      <div className="absolute top-4 right-4 ">
        <BookmarkButton
          articleId={data.id}
        />
      </div>

      {/* BADGES */}
      <div className="flex items-center gap-2 mb-4">
        {data.topics?.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
          >
            {t}
          </span>
        ))}

        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
          {data.cefr}
        </span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {data.title}
      </h1>

      {/* META */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
        {data.author && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{data.author}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formatDate(data.publishedAt)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span className="text-sm">{data.views} lượt xem</span>
        </div>

        <div className="flex items-center gap-1">
          <Globe className="w-4 h-4" />
          <span className="text-sm">{data.source}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
