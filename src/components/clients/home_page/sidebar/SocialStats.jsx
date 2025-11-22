import React from "react";
import {
  Sparkles,
  Youtube,
  Globe,
  Cloud,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";

const SystemIntegrations = () => {
  const integrations = [
    {
      id: "gemini",
      name: "Google Gemini",
      description: "AI Analysis & Processing",
      url: "https://ai.google.dev/docs",
      icon: <Sparkles size={24} />,
      // Gradient mô phỏng màu thương hiệu Gemini (Xanh - Tím)
      bgGradient: "from-blue-600 via-indigo-500 to-purple-600",
    },
    {
      id: "youtube",
      name: "YouTube Data API",
      description: "Video Content Integration",
      url: "https://developers.google.com/youtube/v3",
      icon: <Youtube size={24} />,
      // Gradient mô phỏng màu Youtube (Đỏ)
      bgGradient: "from-red-600 to-rose-500",
    },
    {
      id: "newsapi",
      name: "NewsAPI",
      description: "Global News Aggregation",
      url: "https://newsapi.org/docs",
      icon: <Globe size={24} />,
      // Gradient mô phỏng NewsAPI (Xanh biển đậm)
      bgGradient: "from-sky-600 to-blue-700",
    },
    {
      id: "cloudinary",
      name: "Cloudinary",
      description: "Media Management & CDN",
      url: "https://cloudinary.com/documentation",
      icon: <Cloud size={24} />,
      // Gradient mô phỏng Cloudinary (Indigo - Xanh dương)
      bgGradient: "from-indigo-700 to-blue-600",
    },
  ];

  return (
    <div className="w-full">
      {/* Section Title (Optional) */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-neutral-900 rounded-full"></div>
        <h3 className="text-lg font-bold text-neutral-900">Dịch vụ tích hợp</h3>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full overflow-hidden rounded-2xl h-34 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Background Gradient (Thay bằng <img> nếu bạn có ảnh nền) */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} transition-transform duration-500 group-hover:scale-110`}
            />

            {/* Overlay Pattern (Optional - tạo vân nhẹ) */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Content Container */}
            <div className="relative h-full p-5 flex flex-col justify-between z-10 text-white">
              {/* Header: Icon + External Link Icon */}
              <div className="flex justify-between items-start">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/10 shadow-sm">
                  {item.icon}
                </div>

                <div className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <div className="p-1.5 bg-white/90 text-neutral-900 rounded-full">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>

              {/* Footer: Name & Desc */}
              <div className="py-2">
                <h4 className="font-bold text-lg leading-none mb-1 group-hover:underline decoration-2 underline-offset-4">
                  {item.name}
                </h4>
                <p className="text-xs font-medium text-white/80 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SystemIntegrations;
