import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Eye, Zap } from "lucide-react";

const TopArticles = ({ topArticles = [] }) => {
  // Helper component cho Badge
  const TopicBadge = ({ name }) => (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md border border-white/10">
      {name || "NEWS"}
    </span>
  );

  // Helper component cho Meta info (Ngày, View)
  const MetaInfo = ({ date, views, author }) => (
    <div className="flex items-center flex-wrap gap-3 text-neutral-300 text-xs font-medium mt-2">
      <span>{author}</span>
      <div className="w-1 h-1 rounded-full bg-neutral-500" />
      <div className="flex items-center gap-1">
        <Clock size={12} />
        <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
      </div>
      {views && (
        <>
          <div className="w-1 h-1 rounded-full bg-neutral-500" />
          <div className="flex items-center gap-1">
            <Eye size={12} />
            <span>{views}</span>
          </div>
        </>
      )}
    </div>
  );

  if (!topArticles || topArticles.length === 0) return null;

  const mainArticle = topArticles[0];
  const subArticles = topArticles.slice(1, 3);

  return (
    <div className="max-w-7xl mx-auto">
      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-auto lg:h-[500px]">
        {/* 1. LEFT COLUMN: BIG ARTICLE */}
        {mainArticle && (
          <Link
            to={`/client/article/${mainArticle.id}`}
            className="group relative w-full h-80 lg:h-full rounded-3xl overflow-hidden shadow-sm"
          >
            {/* Image Background */}
            <img
              src={mainArticle.image_url}
              alt={mainArticle.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
              <div className="mb-3">
                <TopicBadge name={mainArticle.topics?.[0]?.name} />
              </div>

              <h3 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-2 line-clamp-3 group-hover:text-neutral-100 transition-colors">
                <span className="bg-left-bottom bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out pb-1">
                  {mainArticle.title}
                </span>
              </h3>

              <MetaInfo
                date={mainArticle.published_at}
                views={mainArticle.views}
                author={mainArticle.author || mainArticle.source_name}
              />
            </div>
          </Link>
        )}

        {/* 2. RIGHT COLUMN: 2 SMALLER ARTICLES */}
        <div className="flex flex-col gap-4 lg:gap-6 h-full">
          {subArticles.map((article) => (
            <Link
              key={article.id}
              to={`/client/article/${article.id}`}
              className="group relative flex-1 rounded-3xl overflow-hidden shadow-sm min-h-[200px]"
            >
              {/* Image Background */}
              <img
                src={article.image_url || null}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6">
                <div className="mb-2">
                  <TopicBadge name={article.topics?.[0]?.name} />
                </div>

                <h3 className="text-white text-lg sm:text-xl font-bold leading-snug line-clamp-2">
                  <span className="bg-left-bottom bg-gradient-to-r from-white to-white bg-[length:0%_1px] bg-no-repeat group-hover:bg-[length:100%_1px] transition-all duration-500 ease-out pb-0.5">
                    {article.title}
                  </span>
                </h3>

                <div className="mt-2">
                  <MetaInfo
                    date={article.published_at}
                    author={article.author || article.source_name}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopArticles;
