import React from "react";
import { Clock, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const SavedArticleCard = ({ article, openUnsaveModal }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Link to={`/client/article/${article.id}`} 
    className="block bg-white rounded-xl shadow-sm hover:shadow-md transform hover:scale-101 duration-300 ease-in-out overflow-hidden">
      <div className="flex gap-4 p-5">
        {article.image_url && (
          <div className="flex-shrink-0">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-48 h-32 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-blue-600">
              {article.source_name}
            </span>
            {article.cefr_level && (
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded">
                {article.cefr_level}
              </span>
            )}
          </div>

          <a
            className="block"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors ease-in-out line-clamp-2">
              {article.title}
            </h2>
          </a>

          {article.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {article.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {article.author && <span>Bởi {article.author}</span>}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {formatDate(article.published_at)} •{" "}
                {formatTime(article.published_at)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.views} lượt xem</span>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <div className="flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault(); // prevent Link navigation
              openUnsaveModal(article);
            }}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transform hover:scale-110 transition-all ease-in-out"
            title="Xóa bài viết"
          >
            <Trash2 className="w-6 h-6 text-red-500 hover:text-red-700 transition-colors ease-in-out" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default SavedArticleCard;
