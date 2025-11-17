import React from "react";

const SocialStats = () => {
  const socials = [
    { icon: "📘", count: "2000+", label: "Fans", color: "bg-blue-700" },
    { icon: "🐦", count: "4000+", label: "Followers", color: "bg-blue-400" },
    { icon: "▶️", count: "1M+", label: "Subscribers", color: "bg-red-600" },
    { icon: "💼", count: "600+", label: "Connections", color: "bg-blue-600" },
    { icon: "💬", count: "1K+", label: "Connections", color: "bg-cyan-400" },
    { icon: "📌", count: "600+", label: "Followers", color: "bg-red-500" },
    { icon: "🎮", count: "1000+", label: "Followers", color: "bg-purple-600" },
    { icon: "📷", count: "1K+", label: "Followers", color: "bg-pink-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {socials.map((s, i) => (
        <div
          key={i}
          className={`${s.color} text-white p-4 rounded-lg hover:opacity-90 transition text-center`}
        >
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className="text-xl font-bold">{s.count}</div>
          <div className="text-xs">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default SocialStats;
