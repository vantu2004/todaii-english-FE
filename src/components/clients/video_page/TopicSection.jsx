import React, { useMemo } from "react";
import { ChevronRight } from "lucide-react";

// Danh sách các dải màu Gradient đẹp (Light Mode)
const RANDOM_GRADIENTS = [
  "from-blue-500 to-cyan-400",
  "from-purple-600 to-indigo-400",
  "from-teal-500 to-emerald-400",
  "from-orange-500 to-amber-300",
  "from-red-500 to-rose-300",
  "from-pink-500 to-fuchsia-400",
  "from-cyan-600 to-blue-400",
  "from-lime-500 to-green-400",
  "from-violet-600 to-purple-400",
  "from-yellow-500 to-orange-300",
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
    <section className="px-6 md:px-12 py-12 bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-900">
          Bạn đang quan tâm gì?
        </h3>
      </div>

      {/* Grid chia đúng 7 cột trên màn hình lớn (lg) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {displayTopics.map((topic) => (
          <div
            key={topic.id}
            onClick={() => onNavigate(null, topic.alias)}
            className={`relative h-28 rounded-2xl bg-gradient-to-br ${topic.color} p-5 flex flex-col justify-end cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 transition-all hover:-translate-y-1 shadow-md group overflow-hidden`}
          >
            {/* Decorative Circle - Hiệu ứng trang trí */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>

            <h4 className="text-white font-bold text-lg leading-tight relative z-10 line-clamp-2">
              {topic.name}
            </h4>

            <div className="flex items-center gap-1 text-white/90 text-xs mt-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity relative z-10">
              <span>Khám phá</span> <ChevronRight size={12} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopicSection;
