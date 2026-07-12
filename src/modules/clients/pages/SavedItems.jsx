import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Video,
  GraduationCap,
  Bookmark,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import LongArticleCard from "@/components/clients/LongArticleCard";
import VideoCard from "@/components/clients/video_page/VideoCard";
import TestCard from "@/components/clients/toeic_page/home/TestCard";
import { getSavedArticlesByUser } from "@/api/clients/articleApi";
import { getSavedVideosByUser } from "@/api/clients/videoApi";
import { getSavedTestsByUser } from "@/api/clients/toeicTestApi";

export default function SavedItems() {
  const [activeTab, setActiveTab] = useState("articles"); // "articles" | "videos" | "tests"
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        getSavedArticlesByUser(),
        getSavedVideosByUser(),
        getSavedTestsByUser(),
      ]);

      if (results[0].status === "fulfilled") {
        setArticles(results[0].value || []);
      } else {
        console.error("Failed to fetch saved articles:", results[0].reason);
      }

      if (results[1].status === "fulfilled") {
        setVideos(results[1].value || []);
      } else {
        console.error("Failed to fetch saved videos:", results[1].reason);
      }

      if (results[2].status === "fulfilled") {
        setTests(results[2].value || []);
      } else {
        console.error("Failed to fetch saved tests:", results[2].reason);
      }
    } catch (error) {
      console.error("Error fetching saved items:", error);
      toast.error("Không thể tải danh sách đã lưu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleArticleToggle = (id, saved) => {
    if (!saved) {
      setArticles((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleVideoToggle = (id, saved) => {
    if (!saved) {
      setVideos((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleTestToggle = (id, saved) => {
    if (!saved) {
      setTests((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Loading Skeleton
  const renderSkeletons = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden h-72"
          >
            <div className="bg-neutral-200 dark:bg-neutral-800 aspect-video w-full" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
              <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-full mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Empty State Helper
  const renderEmptyState = (tabType) => {
    const config = {
      articles: {
        title: "Chưa có bài viết nào được lưu",
        desc: "Hãy lưu các bài báo song ngữ hữu ích để luyện đọc và tích lũy từ vựng.",
        btnText: "Khám phá bài viết",
        link: "/client",
      },
      videos: {
        title: "Chưa có video nào được lưu",
        desc: "Lưu lại các video bổ ích để luyện nghe tiếng Anh qua phụ đề thông minh.",
        btnText: "Khám phá video",
        link: "/client/video",
      },
      tests: {
        title: "Chưa có đề thi nào được lưu",
        desc: "Lưu các đề thi TOEIC sát với đề thật để luyện tập trước kỳ thi.",
        btnText: "Luyện thi ngay",
        link: "/client/toeic",
      },
    };

    const current = config[tabType];

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-neutral-900/40 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 transition-all duration-300">
        <div className="w-12 h-12 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-4 text-neutral-400 dark:text-neutral-500 border border-neutral-100 dark:border-neutral-700/50">
          <Bookmark size={20} />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
          {current.title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm text-center mb-6 leading-relaxed">
          {current.desc}
        </p>
        <Link
          to={current.link}
          className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-xl text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
        >
          {current.btnText}
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-neutral-950 transition-colors duration-200 pt-[68px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
            Nội dung đã lưu
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Quản lý các bài viết, video bài học và đề thi TOEIC đã lưu của bạn.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-8 overflow-x-auto scrollbar-none gap-8">
          <button
            onClick={() => setActiveTab("articles")}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === "articles"
                ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <BookOpen size={16} />
            <span>Bài viết</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
              {articles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === "videos"
                ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Video size={16} />
            <span>Videos</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
              {videos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === "tests"
                ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <GraduationCap size={16} />
            <span>Đề thi TOEIC</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md">
              {tests.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {loading ? (
          renderSkeletons()
        ) : (
          <div className="transition-all duration-300">
            {/* ARTICLES TAB */}
            {activeTab === "articles" &&
              (articles.length > 0 ? (
                <div className="space-y-4 max-w-4xl">
                  {articles.map((article) => (
                    <LongArticleCard
                      key={article.id}
                      {...article}
                      onToggle={handleArticleToggle}
                    />
                  ))}
                </div>
              ) : (
                renderEmptyState("articles")
              ))}

            {/* VIDEOS TAB */}
            {activeTab === "videos" &&
              (videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onToggle={handleVideoToggle}
                    />
                  ))}
                </div>
              ) : (
                renderEmptyState("videos")
              ))}

            {/* TESTS TAB */}
            {activeTab === "tests" &&
              (tests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map((test) => (
                    <TestCard
                      key={test.id}
                      test={test}
                      onToggle={handleTestToggle}
                    />
                  ))}
                </div>
              ) : (
                renderEmptyState("tests")
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
