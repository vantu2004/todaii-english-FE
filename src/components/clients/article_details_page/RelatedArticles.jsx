import { Layers, Calendar, Eye, ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRelatedArticles } from "@/api/clients/articleApi";
import { formatISODate } from "@/utils/FormatDate";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import { getProgress } from "@/api/clients/progressApi";

const RelatedArticles = ({ articleId }) => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const { isLoggedIn } = useClientAuthContext();
  const [progressMap, setProgressMap] = useState({});

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

  useEffect(() => {
    if (isLoggedIn && articles && articles.length > 0) {
      articles.forEach((article) => {
        getProgress(article.id, "ARTICLE")
          .then((data) => {
            if (data && data.study_time > 0) {
              setProgressMap((prev) => ({ ...prev, [article.id]: data }));
            }
          })
          .catch((err) =>
            console.error("Error fetching related article progress:", err),
          );
      });
    }
  }, [articles, isLoggedIn]);

  if (!articles || !articles.length) return null;

  return (
    <div className="bg-white dark:bg-neutral-900/60 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500">
          <Layers size={18} />
        </div>
        <h3 className="font-semibold text-neutral-900 dark:text-white text-base tracking-tight">
          Có thể bạn quan tâm
        </h3>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {articles.map((article) => (
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
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[10px] font-medium text-neutral-400">
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

                {progressMap[article.id] && (
                  <span
                    className={`font-semibold text-[9px] px-1 rounded-sm border
                    ${
                      progressMap[article.id].completed
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/50 dark:border-emerald-900/50"
                        : "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 border-brand-200/50 dark:border-brand-900/50"
                    }`}
                  >
                    {progressMap[article.id].completed
                      ? "Đã đọc"
                      : `Đọc tiếp (${Math.min(
                          100,
                          Math.round(
                            (progressMap[article.id].study_time /
                              progressMap[article.id].estimate_time) *
                              100,
                          ),
                        )}%)`}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
