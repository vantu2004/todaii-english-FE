import { Clock, Eye, Globe, User } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ToggleBookmarkButton from "../ToggleBookmarkButton";
import { isSavedArticle } from "../../../api/clients/articleApi";
import { toggleSavedArticle } from "../../../api/clients/userApi";

const ArticleHeader = ({ data, formatDate }) => {
  const navigate = useNavigate();

  const handleNavigate = (q, alias) => {
    if (q) {
      navigate(`/client/article/filter?q=${encodeURIComponent(q)}`);
    } else {
      navigate(`/client/article/filter?alias=${alias}`);
    }
  };

  return (
    <div className="relative mb-2">
      {/* Top Meta: Topics & Source */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:scale-105 transition-transform duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          {data.topics?.map((t) => (
            <button
              key={t}
              onClick={() => handleNavigate(null, t.alias)}
              className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-bold uppercase tracking-wider border border-neutral-200
                hover:bg-neutral-200 hover:text-neutral-900 hover:scale-105 transition-all duration-200"
            >
              {t.name}
            </button>
          ))}
          <button
            onClick={() => handleNavigate(data.cefr)}
            className="px-3 py-1 bg-neutral-900 text-white rounded-full text-xs font-bold uppercase tracking-wider
              hover:bg-neutral-800 hover:scale-105 transition-all duration-200"
          >
            {data.cefr}
          </button>
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
              <button
                onClick={() => handleNavigate(data.author, null)}
                className="hover:text-blue-600 hover:underline transition-colors duration-200"
              >
                {data.author}
              </button>
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
            <button
              onClick={() => handleNavigate(data.source, null)}
              className="text-neutral-700 hover:text-blue-600 hover:underline transition-colors duration-200"
            >
              {data.source}
            </button>
          </div>
        </div>

        {/* Bookmark Action */}
        <div className="flex-shrink-0">
          <ToggleBookmarkButton
            itemId={data.id}
            checkSavedFn={isSavedArticle}
            toggleSavedFn={toggleSavedArticle}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
