import { Sparkles, Calendar, Eye, ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecommendedArticles } from "@/api/clients/articleApi";
import { formatISODate } from "@/utils/FormatDate";

const RecommendedArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const response = await getRecommendedArticles();
        setArticles(response || []);
      } catch (error) {
        console.error("Error fetching recommended articles in sidebar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading || !articles || !articles.length) return null;

  return (
    <div className="bg-white dark:bg-neutral-900/60 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="p-1.5 bg-brand-500/10 dark:bg-brand-500/5 text-brand-500 rounded">
          <Sparkles size={18} />
        </div>
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-neutral-900 dark:text-white text-base tracking-tight">
            Đề xuất cho bạn
          </h3>
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {articles.slice(0, 3).map((article) => (
          <div
            key={article.id}
            onClick={() => navigate(`/client/article/${article.id}`)}
            className="group flex items-start gap-4 cursor-pointer"
          >
            {/* Thumbnail with Hover Zoom */}
            <div className="relative flex-shrink-0 w-24 h-20 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <ImageOff size={20} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-0">
              {/* Title */}
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-brand-500 transition-colors">
                {article.title}
              </h4>

              {/* Meta Data */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-medium text-neutral-400">
                <span className="text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-sm text-[10px] uppercase tracking-wide">
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

export default RecommendedArticles;
