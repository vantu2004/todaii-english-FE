// src/components/dictionary/RightSidebar.jsx
import React, { useState } from "react";
import { Bot, TrendingUp } from "lucide-react";

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState("trending"); // 'trending' | 'ai'

  return (
    <div className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm h-fit sticky top-24">
      {/* Tabs */}
      <div className="flex p-1 bg-neutral-100 rounded-xl mb-4">
        <button
          onClick={() => setActiveTab("trending")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === "trending"
              ? "bg-white shadow-sm text-neutral-900"
              : "text-neutral-500"
          }`}
        >
          <TrendingUp size={14} /> Trending
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === "ai"
              ? "bg-white shadow-sm text-purple-600"
              : "text-neutral-500"
          }`}
        >
          <Bot size={14} /> AI Assistant
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {activeTab === "trending" ? (
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase mb-3">
              Tìm kiếm phổ biến
            </h4>
            <ul className="space-y-2">
              {[
                "Artificial Intelligence",
                "Sustainable",
                "Entrepreneur",
                "Resilience",
                "Ubiquitous",
              ].map((w, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between text-sm group cursor-pointer"
                >
                  <span className="text-neutral-600 group-hover:text-blue-600 font-medium transition-colors">
                    {w}
                  </span>
                  <span className="text-xs text-neutral-300">#{i + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-center items-center text-center text-neutral-400 p-4">
            <Bot size={32} className="mb-2 opacity-50" />
            <p className="text-xs">
              Trợ lý AI sẵn sàng giải thích ngữ cảnh và đặt câu.
            </p>
            {/* Chỗ này có thể mở rộng thành khung chat nhỏ */}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
