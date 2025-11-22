import { Layers, Calendar, Eye, ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRelatedArticles } from "../../../api/clients/articleApi";
import { formatISODate } from "../../../utils/FormatDate";

const RelatedArticles = ({ articleId }) => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        const response = await getRelatedArticles(articleId);
        setArticles(response || []);
      } catch (error) {
        console.error("Error fetching related articles:", error);
      }
    };

    if (articleId) {
      fetchRelatedArticles();
    }
  }, [articleId]);

  if (!articles || !articles.length) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-50">
        <div className="p-2 bg-neutral-100 rounded-xl text-neutral-700">
          <Layers size={20} />
        </div>
        <h3 className="font-bold text-neutral-900 text-lg tracking-tight">
          Có thể bạn quan tâm
        </h3>
      </div>

      {/* List */}
      <div className="flex flex-col gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => navigate(`/client/article/${article.id}`)}
            className="group flex items-start gap-4 cursor-pointer"
          >
            {/* Thumbnail with Hover Zoom */}
            <div className="relative flex-shrink-0 w-24 h-20 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-100">
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <ImageOff size={20} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0.5">
              {/* Title */}
              <h4 className="text-sm font-bold text-neutral-900 leading-snug line-clamp-2 mb-2 group-hover:text-neutral-600 transition-colors">
                {article.title}
              </h4>

              {/* Meta Data */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-medium text-neutral-400">
                <span className="text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
                  {article.source_name}
                </span>

                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{formatISODate(article.published_at)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{article.views}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
