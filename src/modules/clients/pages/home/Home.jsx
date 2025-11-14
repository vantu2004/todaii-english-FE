import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getLastestArticles,
  getArticlesByDate,
} from "../../../../api/clients/articleApi";
import BigArticleCard from "../../../../components/clients/home_page/BigArticleCard";
import ArticleCard from "../../../../components/clients/home_page/ArticleCard";
import LongArticleCard from "../../../../components/clients/home_page/LongArticleCard";
import BasicDatePicker from "../../../../components/clients/home_page/BasicDatePicker";

import {
  formatDate,
  formatDisplayDate,
  getLastNDays,
} from "../../../../utils/FormatDate";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [articlesByDate, setArticlesByDate] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch latest articles on first load
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const data = await getLastestArticles(10);
        setLatestArticles(data.slice(0, 5));
        setTopStories(data.slice(0, 4)); // Get top 4 for featured section
      } catch (err) {
        console.error(err);
        setError("Failed to load latest articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  // Fetch articles whenever selectedDate changes
  useEffect(() => {
    const fetchByDate = async () => {
      try {
        setLoading(true);
        setPage(1);
        const data = await getArticlesByDate(selectedDate, 1, 1, "id", "asc");
        setArticlesByDate(data.content || []);
        setHasMore(data.total_pages > 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load articles for selected date.");
      } finally {
        setLoading(false);
      }
    };
    fetchByDate();
  }, [selectedDate]);

  const loadMoreArticles = async () => {
    if (!hasMore) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const data = await getArticlesByDate(
        selectedDate,
        nextPage,
        1,
        "id",
        "asc"
      );

      setArticlesByDate((prev) => [...prev, ...data.content]);
      setPage(nextPage);
      setHasMore(nextPage < data.total_pages);
    } catch (err) {
      console.error(err);
      setError("Failed to load more articles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-15 bg-[#f9fafc] min-h-screen py-6">
      <div className="flex flex-wrap max-w-300 mx-auto gap-6">
        {/* LEFT SIDE */}
        <div className="flex-1 px-10">
          <p className="text-base mb-3 italic text-neutral-600 font-bold">
            Tin tức mới nhất trong ngày, cập nhật liên tục 24h. Từ nguồn báo
            chính thống.
          </p>

          {/* Featured Article */}
          {latestArticles.length > 0 && (
            <BigArticleCard
              imgURL={latestArticles[0]?.image_url}
              title={latestArticles[0]?.title}
              source={latestArticles[0]?.source_name}
              updated_at={latestArticles[0]?.updated_at}
              published_at={latestArticles[0]?.published_at}
              views={latestArticles[0]?.views}
            />
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-4 gap-3 mt-5 mb-8">
            {latestArticles.map((article) => (
              <ArticleCard
                key={article?.id}
                imgURL={article?.image_url}
                title={article?.title}
                source={article?.source_name}
                updated_at={article?.updated_at}
                published_at={article?.published_at}
                views={article?.views}
              />
            ))}
          </div>

          {/* TOP STORIES SECTION */}
          <div className="mt-12 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Top Stories</h2>
              <Link
                to="/all-stories"
                className="flex items-center gap-1 text-gray-700 font-semibold hover:text-blue-600 transition"
              >
                ALL TOP STORIES
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Large Featured Story */}
              {topStories[0] && (
                <Link
                  to={`/article/${topStories[0].id}`}
                  className="relative h-96 rounded-2xl overflow-hidden group"
                >
                  <img
                    src={topStories[0].image_url}
                    alt={topStories[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold rounded mb-3">
                      {topStories[0].topics?.[0]?.name || "NEWS"}
                    </span>
                    <h3 className="text-2xl font-bold mb-2 line-clamp-2">
                      {topStories[0].title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <span>By {topStories[0].author || topStories[0].source_name}</span>
                      <span>•</span>
                      <span>{new Date(topStories[0].published_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{topStories[0].views} Views</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Right Column with 2 smaller stories */}
              <div className="flex flex-col gap-4">
                {topStories.slice(1, 3).map((story) => (
                  <Link
                    key={story.id}
                    to={`/article/${story.id}`}
                    className="relative h-44 rounded-2xl overflow-hidden group"
                  >
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <span className="inline-block px-2 py-1 bg-purple-600 text-xs font-bold rounded mb-2">
                        {story.topics?.[0]?.name || "NEWS"}
                      </span>
                      <h3 className="text-lg font-bold line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-1">
                        By {story.author || story.source_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-80 px-4 space-y-6">
          <h3 className="font-semibold mb-3 text-gray-800">
            Đọc báo theo chủ đề
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "Khoa học",
              "Du lịch",
              "Sức khỏe",
              "Thể thao",
              "Giải trí",
              "Học tập",
              "Kinh tế",
              "Văn hóa",
            ].map((tag, i) => (
              <span
                key={i}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-semibold mb-3 text-gray-800">
            Học tiếng Anh với Video
          </h3>
          <div className="bg-white rounded-xl shadow-sm p-3 mb-6">
            <img
              src="https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
              className="w-full rounded-md"
              alt="Video thumbnail"
            />
            <p className="text-sm mt-2 font-medium text-gray-700">
              Online Marketing 101
            </p>
            <span className="text-xs text-gray-500">
              1:05 phút • 20,298 lượt xem
            </span>
          </div>

          {/* Topics Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-gray-900">Topics</h3>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Lifestyle", count: "3+", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400" },
                { name: "Travel", count: "3+", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400" },
                { name: "Beauty", count: "1+", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400" },
                { name: "Drink", count: "1+", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400" },
              ].map((category, i) => (
                <Link
                  key={i}
                  to={`/category/${category.name.toLowerCase()}`}
                  className="relative h-32 rounded-lg overflow-hidden group"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-2xl font-bold">{category.count}</span>
                    <span className="text-sm font-semibold">{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media Stats */}
          <div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "📘", count: "2000+", label: "Fans", color: "bg-blue-700" },
                { icon: "🐦", count: "4000+", label: "Followers", color: "bg-blue-400" },
                { icon: "▶️", count: "1M+", label: "Subscribers", color: "bg-red-600" },
                { icon: "💼", count: "600+", label: "Connections", color: "bg-blue-600" },
                { icon: "💬", count: "1K+", label: "Connections", color: "bg-cyan-400" },
                { icon: "📌", count: "600+", label: "Followers", color: "bg-red-500" },
                { icon: "🎮", count: "1000+", label: "Followers", color: "bg-purple-600" },
                { icon: "📷", count: "1K+", label: "Followers", color: "bg-pink-600" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`${social.color} text-white p-4 rounded-lg hover:opacity-90 transition text-center`}
                >
                  <div className="text-2xl mb-1">{social.icon}</div>
                  <div className="text-xl font-bold">{social.count}</div>
                  <div className="text-xs">{social.label}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* DATE SELECTOR SECTION */}
        <div className="w-full">
          <div className="mb-4">
            <div className="mb-4 font-semibold text-2xl text-gray-700">
              Tìm đọc tin tức theo ngày
            </div>

            <div className="flex items-center gap-5 h-20">
              <button
                className="p-2 hover:bg-blue-500 rounded-full transition-colors bg-white shadow-sm"
                onClick={() => {
                  const container = document.getElementById("date-scroll");
                  container.scrollBy({ left: -200, behavior: "smooth" });
                }}
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>

              <div
                id="date-scroll"
                className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth"
                style={{ scrollBehavior: "smooth", maxWidth: "450px" }}
              >
                {getLastNDays(30).map((date, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded border border-gray-300 font-medium flex-shrink-0 transition-all ${
                      formatDate(selectedDate) === formatDate(date)
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {formatDisplayDate(date)}
                  </button>
                ))}
              </div>

              <button
                className="p-2 hover:bg-blue-500 rounded-full transition-colors bg-white shadow-sm"
                onClick={() => {
                  const container = document.getElementById("date-scroll");
                  container.scrollBy({ left: 200, behavior: "smooth" });
                }}
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>

              <div className="ml-3">
                <BasicDatePicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
            </div>
          </div>

          {/* ARTICLES BY SELECTED DATE */}
          <div className="space-y-8 mb-10">
            {articlesByDate.length > 0 ? (
              articlesByDate.map((article) => (
                <LongArticleCard
                  key={article?.id}
                  imgURL={article?.image_url}
                  title={article?.title}
                  description={article?.paragraphs?.[0]?.text_en}
                  cefr_level={article?.cefr_level}
                  source={article?.source_name}
                  updated_at={article?.updated_at}
                  published_at={article?.published_at}
                  views={article?.views}
                />
              ))
            ) : (
              <p className="text-gray-500">
                Không có bài báo nào trong ngày này.
              </p>
            )}

            {hasMore && (
              <div className="text-center mt-8 mb-4">
                <button
                  className="px-4 py-2 rounded bg-blue-600 font-medium text-white hover:bg-blue-700 transition"
                  onClick={loadMoreArticles}
                  disabled={loading}
                >
                  {loading ? "Đang tải..." : "Xem thêm"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;