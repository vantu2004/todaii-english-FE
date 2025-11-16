import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const topArticles = ({ topArticles = [] }) => {
  return (
    <div>
      {/* TOP articles SECTION */}
      <div className="mt-12 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Top Articles</h2>

          <Link
            to="/all-articles"
            className="flex items-center gap-1 text-gray-700 font-semibold hover:text-blue-600 transition"
          >
            ALL TOP articles
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Large Featured article */}
          {topArticles[0] && (
            <Link
              to={`/article/${topArticles[0].id}`}
              className="relative h-96 rounded-2xl overflow-hidden group"
            >
              <img
                src={topArticles[0].image_url}
                alt={topArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold rounded mb-3">
                  {topArticles[0].topics?.[0]?.name || "NEWS"}
                </span>

                <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                  {topArticles[0].title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-white/80">
                  <span>
                    By {topArticles[0].author || topArticles[0].source_name}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(topArticles[0].published_at).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{topArticles[0].views} Views</span>
                </div>
              </div>
            </Link>
          )}

          {/* Right Column with 2 smaller articles */}
          <div className="flex flex-col gap-4 justify-between">
            {topArticles.slice(1, 3).map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="relative h-45 rounded-2xl overflow-hidden group"
              >
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className="inline-block px-2 py-1 bg-purple-600 text-xs font-bold rounded mb-2">
                    {article.topics?.[0]?.name || "NEWS"}
                  </span>

                  <h3 className="text-lg font-bold line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-white/80 mt-1">
                    By {article.author || article.source_name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default topArticles;
