import { Clock, Eye, Globe, Calendar, User } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import { ArrowLeft } from "lucide-react";

const ArticleHeader = ({ data, formatDate }) => {
  return (
    <div className="relative mb-2">
      {/* Top Meta: Topics & Source */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-3">
          {data.topics?.map((t) => (
            <span
              key={t}
              className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-bold uppercase tracking-wider border border-neutral-200"
            >
              {t}
            </span>
          ))}
          <span className="px-3 py-1 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-wider">
            {data.cefr}
          </span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4 leading-tight tracking-tight">
        {data.title}
      </h1>

      {/* Meta Data Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-neutral-100">
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 font-medium">
          {data.author && (
            <div className="flex items-center gap-2 text-neutral-900">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <User size={14} />
              </div>
              <span>{data.author}</span>
            </div>
          )}

          <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300" />

          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span>{formatDate(data.publishedAt)}</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300" />

          <div className="flex items-center gap-1.5">
            <Eye size={16} />
            <span>{data.views} lượt xem</span>
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-300" />

          <div className="flex items-center gap-1.5">
            <Globe size={16} />
            <span className="text-neutral-700">{data.source}</span>
          </div>
        </div>

        {/* Bookmark Action */}
        <div className="flex-shrink-0">
          <BookmarkButton articleId={data.id} />
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
