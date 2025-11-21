import React, { useState, useEffect, useRef } from "react";
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
import SearchBar from "./../../../../components/clients/SearchBar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {
    latestArticles,
    topArticles,
    loading: articlesLoading,
  } = useArticle(10);

  const {
    articlesByDate,
    selectedDate,
    setSelectedDate,
    hasMore,
    loading: dateLoading,
    loadMoreArticles,
  } = useArticlesByDate();

  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();

  // Auto-sliding state
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Prepare slides: group every 4 articles (skip first one used in BigArticleCard)
  const articlesForCarousel = latestArticles.slice(1);
  const slides = [];
  for (let i = 0; i < articlesForCarousel.length; i += 4) {
    slides.push(articlesForCarousel.slice(i, i + 4));
  }

  // Auto slide every 2 seconds
  useEffect(() => {
    if (articlesLoading || slides.length <= 1) return;

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2000);

    // Cleanup on unmount or when index changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, articlesLoading, slides.length]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!articlesLoading && slides.length > 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 2000);
    }
  };

  return (
    <div className="mt-20 bg-[#f9fafc] min-h-screen py-6">
      <div className="flex flex-wrap max-w-300 mx-auto gap-6">
        {/* LEFT SIDE */}
        <div className="flex-1 px-10">
          <SearchBar
            value={keyword}
            placeholder="Tìm kiếm bài báo..."
            onSearch={(text) => {
              setKeyword(text);
              navigate(`/client/search?q=${encodeURIComponent(text)}`);
            }}
          />

          <p className="text-base mb-3 italic text-neutral-600 font-bold">
            Tin tức mới nhất trong ngày, cập nhật liên tục 24h. Từ nguồn báo
            chính thống.
          </p>

          {/* Featured Big Article */}
          {articlesLoading ? (
            <div className="animate-pulse bg-gray-200 h-96 rounded-xl mb-5"></div>
          ) : latestArticles.length > 0 ? (
            <BigArticleCard {...latestArticles[0]} />
          ) : null}

          {/* AUTO-SLIDING CAROUSEL */}
          <div
            className="mt-5 mb-8 overflow-hidden rounded-xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {articlesLoading
                ? // Skeleton slides
                  Array(4)
                    .fill(0)
                    .map((_, idx) => (
                      <div key={idx} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-4 gap-3 px-2">
                          {Array(4)
                            .fill(0)
                            .map((_, i) => (
                              <div
                                key={i}
                                className="animate-pulse bg-gray-200 h-48 rounded-xl"
                              ></div>
                            ))}
                        </div>
                      </div>
                    ))
                : slides.map((slide, slideIdx) => (
                    <div key={slideIdx} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-4 gap-3 px-2">
                        {slide.map((article) => (
                          <ArticleCard key={article.id} {...article} />
                        ))}
                        {/* Fill empty slots if less than 4 items */}
                        {slide.length < 4 &&
                          Array(4 - slide.length)
                            .fill(0)
                            .map((_, i) => (
                              <div key={`empty-${i}`} className="h-48"></div>
                            ))}
                      </div>
                    </div>
                  ))}
            </div>

            {/* Dots Indicator */}
            {!articlesLoading && slides.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 w-2 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <TopArticles topArticles={topArticles} loading={articlesLoading} />

          <ArticlesByDate
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            articlesByDate={articlesByDate}
            hasMore={hasMore}
            loading={dateLoading}
            loadMoreArticles={loadMoreArticles}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-80 px-4 space-y-6">
          <TopicTags />
          <h3 className="font-semibold mb-3 text-gray-800">
            Học tiếng Anh với Video
          </h3>
          <VideoCard
            videoURL="https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
            title="Online Marketing 101"
            duration="1:05"
            views="20,298"
          />
          <TopicGrid />
          <SocialStats />
        </div>
      </div>
    </div>
  );
};

export default Home;
