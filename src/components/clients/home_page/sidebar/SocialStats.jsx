import React from "react";
import {
  Sparkles,
  Youtube,
  Globe,
  Cloud,
  ArrowUpRight,
  Blocks, // Icon đại diện cho "Integrations"
} from "lucide-react";

const SystemIntegrations = () => {
  const integrations = [
    {
      id: "gemini",
      name: "Google Gemini",
      description: "AI Analysis & Processing",
      url: "https://ai.google.dev/docs",
      icon: <Sparkles size={20} />,
      bgGradient: "from-blue-600 via-indigo-500 to-purple-600",
    },
    {
      id: "youtube",
      name: "YouTube API",
      description: "Video Integration",
      url: "https://developers.google.com/youtube/v3",
      icon: <Youtube size={20} />,
      bgGradient: "from-red-600 to-rose-500",
    },
    {
      id: "newsapi",
      name: "NewsAPI",
      description: "Global Aggregation",
      url: "https://newsapi.org/docs",
      icon: <Globe size={20} />,
      bgGradient: "from-sky-600 to-blue-700",
    },
    {
      id: "cloudinary",
      name: "Cloudinary",
      description: "Media CDN",
      url: "https://cloudinary.com/documentation",
      icon: <Cloud size={20} />,
      bgGradient: "from-indigo-700 to-blue-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
      {/* Header Section (Đồng bộ với TopicTags/RelatedArticles) */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-50">
        <div className="p-2 bg-neutral-100 rounded-xl text-neutral-700">
          <Blocks size={20} />
        </div>
        <h3 className="font-bold text-neutral-900 text-lg">Dịch vụ tích hợp</h3>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {integrations.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group relative block w-full overflow-hidden rounded-2xl h-28 
              transition-all duration-300 hover:shadow-md hover:-translate-y-1
            "
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} transition-transform duration-700 group-hover:scale-110`}
            />

            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Content */}
            <div className="relative h-full p-4 flex flex-col justify-between z-10 text-white">
              {/* Top Row: Icon & Link */}
              <div className="flex justify-between items-start">
                <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg border border-white/10 shadow-sm">
                  {item.icon}
                </div>

                <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <div className="p-1 bg-white text-neutral-900 rounded-full shadow-sm">
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Text */}
              <div>
                <h4 className="font-bold text-sm leading-tight mb-0.5 group-hover:underline decoration-2 underline-offset-2">
                  {item.name}
                </h4>
                <p className="text-[10px] font-medium text-white/80 line-clamp-1">
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
