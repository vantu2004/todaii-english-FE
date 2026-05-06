import React, { useMemo } from "react";
import { ChevronRight } from "lucide-react";

// Danh sách các dải màu Gradient đẹp (Light Mode)
const RANDOM_GRADIENTS = [
  "from-blue-500/20 to-blue-50 dark:from-blue-500/20 dark:to-blue-900/20",
  "from-emerald-500/20 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-900/20",
  "from-amber-500/20 to-amber-50 dark:from-amber-500/20 dark:to-amber-900/20",
  "from-rose-500/20 to-rose-50 dark:from-rose-500/20 dark:to-rose-900/20",
  "from-purple-500/20 to-purple-50 dark:from-purple-500/20 dark:to-purple-900/20",
  "from-cyan-500/20 to-cyan-50 dark:from-cyan-500/20 dark:to-cyan-900/20",
  "from-brand-500/20 to-brand-50 dark:from-brand-500/20 dark:to-brand-900/20",
];

const TopicSection = ({ topics = [], onNavigate }) => {
  // Xử lý logic: Lấy 7 phần tử đầu & Gán màu ngẫu nhiên
  const displayTopics = useMemo(() => {
    // 1. Chỉ lấy 7 topic đầu tiên
    const slicedTopics = topics.slice(0, 7);

    // 2. Map để gán màu
    return slicedTopics.map((topic) => {
      // Chọn ngẫu nhiên 1 màu từ danh sách
      const randomColor =
        RANDOM_GRADIENTS[Math.floor(Math.random() * RANDOM_GRADIENTS.length)];

      return {
        ...topic,
        // Ưu tiên màu có sẵn, nếu không có thì dùng màu random
        color: topic.color || randomColor,
      };
    });
  }, [topics]);

  if (displayTopics.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-12 bg-surface-primary dark:bg-neutral-950">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-brand-500 rounded-full"></div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
          Bạn đang quan tâm gì?
        </h3>
      </div>

      {/* Grid chia đúng 7 cột trên màn hình lớn (lg) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {displayTopics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => onNavigate(null, topic.alias)}
            className={`relative h-28 rounded-2xl bg-gradient-to-br ${topic.color} p-5 flex flex-col justify-end cursor-pointer hover:shadow-lg hover:shadow-brand-500/20 transition-all hover:-translate-y-1 shadow-sm group overflow-hidden border border-neutral-100 dark:border-neutral-800`}
          >
            {/* Decorative Circle - Hiệu ứng trang trí */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/50 dark:bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

            <h4 className="text-neutral-900 dark:text-white font-bold text-lg leading-tight relative z-10 line-clamp-2">
              {topic.name}
            </h4>

            <div className="flex items-center gap-1 text-brand-600 dark:text-brand-400 text-xs mt-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity relative z-10">
              <span>Khám phá</span> <ChevronRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopicSection;
