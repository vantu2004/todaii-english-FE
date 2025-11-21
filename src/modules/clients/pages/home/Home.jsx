import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  // Prepare slides
  const articlesForCarousel = latestArticles.slice(1);
  const slides = [];
  for (let i = 0; i < articlesForCarousel.length; i += 4) {
    slides.push(articlesForCarousel.slice(i, i + 4));
  }

  // Auto slide
  useEffect(() => {
    if (articlesLoading || slides.length <= 1 || isHovered) return;
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, articlesLoading, slides.length, isHovered]);

  const goToSlide = (idx) => setCurrentIndex(idx);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);

  return (
    <div className="min-h-screen bg-neutral-50/50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
              Khám phá tin tức
            </h1>
            <p className="mt-2 text-neutral-500 text-sm sm:text-base leading-relaxed">
              Cập nhật tin tức mới nhất trong ngày từ các nguồn báo chính thống
            </p>
          </div>

          {/* Search */}
          <div className="max-w-full mt-4">
            <SearchBar
              value={keyword}
              placeholder="Tìm kiếm bài viết..."
              onSearch={(text) => {
                setKeyword(text);
                navigate(`/client/search?q=${encodeURIComponent(text)}`);
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT - Main Content */}
          <div className="flex-1 min-w-0">
            {/* Featured Article */}
            <section className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Nổi bật
                </h2>
                <div className="h-px flex-1 bg-neutral-200 ml-4" />
              </div>

              {articlesLoading ? (
                <div className="animate-pulse bg-neutral-200 h-80 sm:h-96 rounded-2xl" />
              ) : latestArticles.length > 0 ? (
                <BigArticleCard {...latestArticles[0]} />
              ) : null}
            </section>

            {/* Carousel Section */}
            <section
              className="mb-12"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Mới cập nhật
                </h2>

                {/* Navigation Arrows */}
                {!articlesLoading && slides.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all duration-200 hover:shadow-sm"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all duration-200 hover:shadow-sm"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Carousel */}
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {articlesLoading ? (
                    <div className="w-full flex-shrink-0">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="animate-pulse bg-neutral-200 h-52 rounded-xl"
                            />
                          ))}
                      </div>
                    </div>
                  ) : (
                    slides.map((slide, slideIdx) => (
                      <div key={slideIdx} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {slide.map((article) => (
                            <ArticleCard key={article.id} {...article} />
                          ))}
                          {slide.length < 4 &&
                            Array(4 - slide.length)
                              .fill(0)
                              .map((_, i) => (
                                <div key={`empty-${i}`} className="h-52" />
                              ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Dots */}
              {!articlesLoading && slides.length > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? "bg-neutral-800 w-6"
                          : "bg-neutral-300 w-1.5 hover:bg-neutral-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Top Articles */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Đọc nhiều nhất
                </h2>
                <div className="h-px flex-1 bg-neutral-200 ml-4" />
              </div>
              <TopArticles
                topArticles={topArticles}
                loading={articlesLoading}
              />
            </section>

            {/* Articles by Date */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Theo ngày
                </h2>
                <div className="h-px flex-1 bg-neutral-200 ml-4" />
              </div>
              <ArticlesByDate
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                articlesByDate={articlesByDate}
                hasMore={hasMore}
                loading={dateLoading}
                loadMoreArticles={loadMoreArticles}
              />
            </section>
          </div>

          {/* RIGHT - Sidebar */}
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Topics */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                  Chủ đề
                </h3>
                <TopicTags />
              </div>

              {/* Video Section */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                  Video học tiếng Anh
                </h3>
                <VideoCard
                  videoURL="https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
                  title="Online Marketing 101"
                  duration="1:05"
                  views="20,298"
                />
              </div>

              {/* Topic Grid */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                  Danh mục
                </h3>
                <TopicGrid />
              </div>

              {/* Social Stats */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                  Kết nối
                </h3>
                <SocialStats />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Home;
