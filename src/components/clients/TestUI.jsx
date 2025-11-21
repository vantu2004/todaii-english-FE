import React, { useState } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Bookmark,
  TrendingUp,
  Menu, // Thêm icon menu cho mobile
} from "lucide-react";

const TestUI = () => {
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedDate, setSelectedDate] = useState("Nov 19");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State cho menu mobile

  const featuredNews = {
    title:
      "Asia's 'most beautiful island' receives 7.1 million tourists in 10 months",
    source: "TODAII",
    time: "2025-11-20 07:31:43",
    views: 1089,
    readTime: "1 phút",
    image:
      "https://admin.todaienglish.com/images/news/ed7a0b3fd5c10c9705b665a0191a3484.webp",
    levels: { level1: 64.7, level2: 32.4, level3: 2.9, level4: 0 },
  };

  const topNews = [
    {
      title: "Unhealthy smog returns to Hanoi as stagnant weather traps PM2.5",
      source: "TODAII",
      time: "2025-11-20 07:31:01",
      views: 671,
      image:
        "https://admin.todaienglish.com/images/news/78e306f3c865acc43fd8e471c83befea.webp",
      levels: { level1: 64.1, level2: 17.9, level3: 12.8, level4: 5.1 },
    },
    {
      title:
        "Sales of AI-enabled teddy bear suspended after it gave advice on BDSM sex and where to find knives",
      source: "CNN",
      time: "2025-11-20 07:30:52",
      views: 440,
      image:
        "https://admin.todaienglish.com/images/news/acd90f9d70c6eef453802ace7ec139c3.avif",
      levels: { level1: 60.6, level2: 27.3, level3: 3.0, level4: 9.1 },
    },
    {
      title:
        "Authentic Hanoi flavors find a new home in US restaurant named among 50 best",
      source: "TODAII",
      time: "2025-11-20 07:31:31",
      views: 407,
      image:
        "https://admin.todaienglish.com/images/news/6260275d5ab46703707e5fed14d3720c.webp",
      levels: { level1: 69.2, level2: 25.0, level3: 3.8, level4: 1.9 },
    },
    {
      title:
        "Woman allegedly avoids paying at restaurants while flaunting luxury lifestyle online",
      source: "TODAII",
      time: "2025-11-20 07:31:20",
      views: 330,
      image:
        "https://admin.todaienglish.com/images/news/41ec4b05d034b43fe1dfb48585d67a78.webp",
      levels: { level1: 68.5, level2: 22.2, level3: 5.6, level4: 3.7 },
    },
  ];

  const recentNews = [
    {
      title:
        "IELTS scoring glitch forces major Vietnam universities to recheck accepted students",
      source: "TODAII",
      time: "2025-11-19 07:31:44",
      views: 1375,
      readTime: "2 phút",
      excerpt:
        "Universities across Vietnam are reviewing students admitted with IELTS scores after the test organizers revealed a global technical error affecting exams taken between August 2023 and September 2024...",
      image:
        "https://admin.todaienglish.com/images/news/85ae2818f670bba4d834456ef3f453de.webp",
      levels: { level1: 57.8, level2: 33.3, level3: 2.2, level4: 6.7 },
    },
    {
      title:
        "Tourist returns 14 kg of pebbles taken from Vietnam's Co To Island a decade ago",
      source: "TODAII",
      time: "2025-11-19 07:31:36",
      views: 440,
      readTime: "2 phút",
      excerpt:
        "A tourist from Ha Long returned 14 kilograms of pebbles he had taken from Mong Rong Beach on Co To Island a decade ago, sending them back with a handwritten apology...",
      image:
        "https://admin.todaienglish.com/images/news/f6633ce66fdf71a300d135c5d431b350.webp",
      levels: { level1: 54.8, level2: 29.0, level3: 6.5, level4: 9.7 },
    },
  ];

  const topics = [
    "Khoa học và công nghệ",
    "Du lịch",
    "Phong cách sống",
    "Thế giới đó đây",
    "Có thể bạn chưa biết",
    "Truyện ngắn",
    "Truyện cười",
    "Sức khỏe",
    "Giải trí",
    "Văn hoá nghệ thuật",
    "Học tập",
    "Kinh tế",
    "Thể thao",
    "Động vật",
    "Chính trị và xã hội",
    "Thế giới tự nhiên",
    "Thực phẩm",
    "Chung",
  ];

  const videos = [
    {
      title: "Online Marketing 101",
      views: 20372,
      duration: "1:05",
      level: "Trung bình",
      thumbnail: "https://i.ytimg.com/vi/fipp7cJiWJU/hqdefault.jpg",
    },
    {
      title: "Business Management Careers",
      views: 13340,
      duration: "1:09",
      level: "Trung bình",
      thumbnail: "https://i.ytimg.com/vi/bzKn7-cHeFA/hqdefault.jpg",
    },
    {
      title: "What Is a Franchise Model?",
      views: 2546,
      duration: "1:26",
      level: "Trung bình",
      thumbnail: "https://i.ytimg.com/vi/1VYvqzVJhyU/hqdefault.jpg",
    },
  ];

  const LevelBar = ({ levels }) => (
    <div className="flex h-1 w-full rounded-full overflow-hidden bg-gray-100">
      <div
        className="bg-emerald-500"
        style={{ width: `${levels.level1}%` }}
      ></div>
      <div className="bg-blue-500" style={{ width: `${levels.level2}%` }}></div>
      <div
        className="bg-amber-500"
        style={{ width: `${levels.level3}%` }}
      ></div>
      <div className="bg-rose-500" style={{ width: `${levels.level4}%` }}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 md:gap-8">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu size={24} className="text-gray-600" />
              </button>

              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                TodaiEnglish
              </h1>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex gap-6">
                <button className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
                  Trang chủ
                </button>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Video
                </button>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Từ vựng
                </button>
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Ngữ pháp
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bookmark size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Nav Overlay */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2">
              <div className="flex flex-col gap-3">
                <button className="text-left text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                  Trang chủ
                </button>
                <button className="text-left text-sm font-medium text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-lg">
                  Video
                </button>
                <button className="text-left text-sm font-medium text-gray-600 px-4 py-2 hover:bg-gray-50 rounded-lg">
                  Từ vựng
                </button>
              </div>
            </nav>
          )}

          {/* Filters - Wrapped and Scrollable on mobile if needed */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <BookOpen size={16} />
                Tra cứu
              </button>
              <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-400 transition-colors flex items-center gap-2">
                <Search size={16} />
                Tìm báo
              </button>
            </div>

            <div className="hidden sm:block h-8 w-px bg-gray-300"></div>

            {/* Dropdowns - stack on mobile, inline on tablet+ */}
            <div className="flex flex-1 gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="flex-shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
              </select>

              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="flex-shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả nguồn</option>
                <option value="voa">VOA</option>
                <option value="bbc">BBC</option>
                <option value="cnn">CNN</option>
                <option value="todaii">TODAII</option>
              </select>

              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="flex-shrink-0 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-[150px]"
              >
                <option value="all">Tất cả chủ đề</option>
                {topics.map((topic, idx) => (
                  <option key={idx} value={topic.toLowerCase()}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        {/* Layout change: Flex col on mobile, row on large screens */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {" "}
            {/* min-w-0 prevents flex items from overflowing */}
            {/* Featured & Top News Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {/* Featured News */}
              <div className="col-span-1 xl:col-span-1">
                <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-64 sm:h-80 xl:h-[480px] overflow-hidden">
                    <img
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md">
                        {featuredNews.source}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight line-clamp-3">
                        {featuredNews.title}
                      </h2>
                      <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {featuredNews.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {featuredNews.views}
                        </span>
                        <span className="hidden sm:inline">
                          {featuredNews.time.split(" ")[0]}
                        </span>
                      </div>
                      <LevelBar levels={featuredNews.levels} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top News Grid - Vertical list on mobile/desktop */}
              <div className="col-span-1 xl:col-span-1 flex flex-col gap-4">
                {topNews.slice(0, 3).map((news, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="relative w-28 sm:w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {news.source}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {news.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Horizontal News Scroll */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={24} className="text-blue-600" />
                  Tin nổi bật
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
              {/* -mx-4 px-4 to allow full bleed on mobile if desired, kept contained here */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {topNews.map((news, idx) => (
                  <div
                    key={idx}
                    className="group flex-shrink-0 w-64 sm:w-72 bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2 py-1 bg-white/95 text-gray-700 text-xs font-semibold rounded">
                        {news.source}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h3>
                      <LevelBar levels={news.levels} />
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {news.views}
                        </span>
                        <span>{news.time.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Date Filter - Scrollable on Mobile */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Xem theo ngày
              </h2>
              <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                {["Nov 19", "Nov 18", "Nov 17", "Nov 16"].map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`flex-shrink-0 px-4 md:px-6 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                      selectedDate === date
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {date}
                  </button>
                ))}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
                <button className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Calendar size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
            {/* Recent News List */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Tin mới nhất</h2>
              {recentNews.map((news, idx) => (
                <article
                  key={idx}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Responsive Flex direction for article: col on mobile, row on desktop */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                    <div className="relative w-full sm:w-80 h-48 sm:h-48 flex-shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                        {news.readTime}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                          {news.source}
                        </span>
                        <span className="text-xs text-gray-500">
                          {news.time}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed hidden sm:block">
                        {news.excerpt}
                      </p>
                      <div className="mt-auto">
                        <LevelBar levels={news.levels} />
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {news.views} lượt xem
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <button className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-blue-600 hover:text-blue-600 transition-all">
                Xem thêm bài viết
              </button>
            </div>
          </div>

          {/* Right Sidebar - Responsive width */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Topics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Chủ đề</h2>
              <div className="flex flex-wrap gap-2">
                {topics.slice(0, 12).map((topic, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Articles */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Đã lưu</h2>
              <div className="space-y-3">
                {[
                  "Delgado, Kent, Sheffield join Hall of Fame ballot",
                  "Hong Kong schools close as Storm Tapah brushes",
                  "Grammar Games at Home: Jeopardy",
                ].map((title, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-blue-600 font-bold text-sm">
                        {idx + 1}.
                      </span>
                      <p className="text-sm text-gray-700 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Video học tập
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {videos.map((video, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="relative rounded-lg overflow-hidden mb-2">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play
                            size={20}
                            className="text-blue-600 ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-xs">
                        <span className="px-2 py-0.5 bg-black/60 rounded flex items-center gap-1">
                          <Eye size={10} />
                          {video.views.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 bg-black/60 rounded">
                          {video.duration}
                        </span>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded">
                          {video.level}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TestUI;
