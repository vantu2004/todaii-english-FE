import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import BigArticleCard from "../../../../components/clients/home_page/BigArticleCard";
import ArticleCard from "../../../../components/clients/home_page/ArticleCard";
import ArticlesByDate from "../../../../components/clients/home_page/ArticlesByDate";
import TopArticles from "../../../../components/clients/home_page/TopArticles";
import useArticle from "../../../../hooks/clients/useArticle";
import useArticlesByDate from "../../../../hooks/clients/useArticleByDate";
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
    <div className="mt-15 bg-[#f9fafc] min-h-screen py-6">
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
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-semibold mb-3 text-gray-800">
            Học tiếng Anh với Video
          </h3>
          <div className="bg-white rounded-xl shadow-sm p-3 mb-6 hover:shadow-md transition-shadow">
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
                {
                  name: "Lifestyle",
                  count: "3+",
                  image:
                    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
                },
                {
                  name: "Travel",
                  count: "3+",
                  image:
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
                },
                {
                  name: "Beauty",
                  count: "1+",
                  image:
                    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
                },
                {
                  name: "Drink",
                  count: "1+",
                  image:
                    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
                },
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
                    <span className="text-sm font-semibold">
                      {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media Stats */}
          <div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: "📘",
                  count: "2000+",
                  label: "Fans",
                  color: "bg-blue-700",
                },
                {
                  icon: "🐦",
                  count: "4000+",
                  label: "Followers",
                  color: "bg-blue-400",
                },
                {
                  icon: "▶️",
                  count: "1M+",
                  label: "Subscribers",
                  color: "bg-red-600",
                },
                {
                  icon: "💼",
                  count: "600+",
                  label: "Connections",
                  color: "bg-blue-600",
                },
                {
                  icon: "💬",
                  count: "1K+",
                  label: "Connections",
                  color: "bg-cyan-400",
                },
                {
                  icon: "📌",
                  count: "600+",
                  label: "Followers",
                  color: "bg-red-500",
                },
                {
                  icon: "🎮",
                  count: "1000+",
                  label: "Followers",
                  color: "bg-purple-600",
                },
                {
                  icon: "📷",
                  count: "1K+",
                  label: "Followers",
                  color: "bg-pink-600",
                },
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
      </div>
    </div>
  );
};

export default Home;
