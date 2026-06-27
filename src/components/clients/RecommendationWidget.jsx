import { useEffect, useState } from "react";
import { Sparkles, BookOpen, Video, Award, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getRecommendedArticles } from "@/api/clients/articleApi";
import { getRecommendedVideos } from "@/api/clients/videoApi";
import { getRecommendedTests } from "@/api/clients/toeicTestApi";
import ArticleCard from "@/components/clients/home_page/ArticleCard";
import VideoCard from "@/components/clients/video_page/VideoCard";
import TestCard from "@/components/clients/toeic_page/home/TestCard";

const RecommendationWidget = ({ type = "articles" }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [weakestPart, setWeakestPart] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(false);
        if (type === "articles") {
          const res = await getRecommendedArticles();
          if (active) setItems(res || []);
        } else if (type === "videos") {
          const res = await getRecommendedVideos();
          if (active) setItems(res || []);
        } else if (type === "tests") {
          const res = await getRecommendedTests();
          if (active) {
            setMessage(res?.message || "");
            setWeakestPart(res?.weakest_part || null);
            setItems(res?.tests || []);
          }
        }
      } catch (err) {
        console.error(`Failed to fetch recommendations for ${type}:`, err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      active = false;
    };
  }, [type]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="animate-pulse bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl h-64"
          />
        ))}
      </div>
    );
  }

  if (error || items.length === 0) {
    // Return null to hide the recommendation section if empty or failed
    return null;
  }

  // Define metadata based on type
  const getMeta = () => {
    switch (type) {
      case "articles":
        return {
          title: "Đề xuất đọc báo",
          subtitle: "Bài đọc phù hợp với trình độ CEFR của bạn",
          icon: <BookOpen className="text-brand-500 w-5 h-5" />,
        };
      case "videos":
        return {
          title: "Gợi ý xem Video",
          subtitle: "Luyện nghe tiếng Anh theo trình độ của bạn",
          icon: <Video className="text-brand-500 w-5 h-5" />,
        };
      case "tests":
        return {
          title: "Luyện đề TOEIC gợi ý",
          subtitle: "Đề thi được đề xuất dựa trên điểm số thực tế",
          icon: <Award className="text-brand-500 w-5 h-5" />,
        };
      default:
        return {
          title: "Đề xuất cho bạn",
          subtitle: "Nội dung học tập được cá nhân hóa",
          icon: <Sparkles className="text-brand-500 w-5 h-5" />,
        };
    }
  };

  const meta = getMeta();

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-10 p-6 rounded-2xl bg-brand-500/[0.02] dark:bg-neutral-900/20 border border-brand-500/10 dark:border-neutral-800/60"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-500/10 dark:bg-brand-500/5 text-brand-500 rounded-xl">
            {meta.icon}
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              {meta.title}
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {type === "tests" && message && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 dark:bg-yellow-500/5 border border-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl text-xs font-medium">
            <AlertCircle size={14} />
            <span>{message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => {
          if (type === "articles") {
            return (
              <div key={item.id} className="h-full">
                <ArticleCard {...item} />
              </div>
            );
          } else if (type === "videos") {
            return (
              <div key={item.id} className="h-full">
                <VideoCard video={item} />
              </div>
            );
          } else if (type === "tests") {
            return (
              <div key={item.id} className="h-full">
                <TestCard test={item} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </motion.section>
  );
};

export default RecommendationWidget;
