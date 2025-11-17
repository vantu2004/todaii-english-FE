import React from "react";

const TopicTags = () => {
  const tags = [
    "Khoa học",
    "Du lịch",
    "Sức khỏe",
    "Thể thao",
    "Giải trí",
    "Học tập",
    "Kinh tế",
    "Văn hóa",
  ];

  return (
    <div>
      <h3 className="font-semibold mb-3 text-gray-800">Đọc báo theo chủ đề</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full 
                       hover:bg-blue-100 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopicTags;
