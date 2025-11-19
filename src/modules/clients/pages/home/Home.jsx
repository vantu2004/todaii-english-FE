import React from "react";
import BigArticleCard from "../../../../components/clients/home_page/BigArticleCard";
import ArticleCard from "../../../../components/clients/home_page/ArticleCard";
import ArticlesByDate from "../../../../components/clients/home_page/ArticlesByDate";
import TopArticles from "../../../../components/clients/home_page/TopArticles";
import useArticle from "../../../../hooks/clients/useArticle";
import useArticlesByDate from "../../../../hooks/clients/useArticleByDate";
import SocialStats from "../../../../components/clients/home_page/sidebar/SocialStats";
import TopicGrid from "../../../../components/clients/home_page/sidebar/TopicGrid";
import VideoCard from "../../../../components/clients/home_page/sidebar/VideoCard";
import TopicTags from "./../../../../components/clients/home_page/sidebar/TopicTags";
const Home = () => {
  // Fetch latest and top articles
  const {
    latestArticles,
    topArticles,
    loading: articlesLoading,
    error: articlesError,
  } = useArticle(10);

  // Fetch articles by date with pagination
  const {
    articlesByDate,
    selectedDate,
    setSelectedDate,
    hasMore,
    loading: dateLoading,
    error: dateError,
    loadMoreArticles,
  } = useArticlesByDate();

  return (
    <div className="mt-20 bg-[#f9fafc] min-h-screen py-6">
      <div className="flex flex-wrap max-w-300 mx-auto gap-6">
        {/* LEFT SIDE */}
        <div className="flex-1 px-10">
          <p className="text-base mb-3 italic text-neutral-600 font-bold">
            Tin tức mới nhất trong ngày, cập nhật liên tục 24h. Từ nguồn báo
            chính thống.
          </p>

          {/* Featured Article */}
          {articlesLoading ? (
            <div className="animate-pulse bg-gray-200 h-96 rounded-xl mb-5"></div>
          ) : latestArticles.length > 0 ? (
            <BigArticleCard {...latestArticles[0]} />
          ) : null}

          {/* Article Grid */}
          <div className="grid grid-cols-4 gap-3 mt-5 mb-8">
            {articlesLoading
              ? // Loading skeleton
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse bg-gray-200 h-48 rounded-xl"
                    ></div>
                  ))
              : latestArticles.map((article) => (
                  <ArticleCard key={article?.id} {...article} />
                ))}
          </div>

          {/* TOP ARTICLES SECTION */}
          <TopArticles topArticles={topArticles} loading={articlesLoading} />

          {/* ARTICLES BY DATE SECTION */}
          <ArticlesByDate
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            articlesByDate={articlesByDate}
            hasMore={hasMore}
            loading={dateLoading}
            loadMoreArticles={loadMoreArticles}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-80 px-4 space-y-6">
          <TopicTags />
          {/* Videos Section */}
          <h3 className="font-semibold mb-3 text-gray-800">
            Học tiếng Anh với Video
          </h3>
          <VideoCard
            videoURL="https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
            title="Online Marketing 101"
            duration="1:05"
            views="20,298"
          />

          {/* Topics Section */}
          <TopicGrid />
          {/* Social Media Stats */}
          <SocialStats />
        </div>
      </div>
    </div>
  );
};

export default Home;
