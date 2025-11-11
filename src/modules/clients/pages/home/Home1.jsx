import React from "react";

const Home = () => {
  return (
    <div className="bg-[#f9fafc] min-h-screen py-6">
      <div className="max-w-[1200px] mx-auto flex gap-6">
        
        {/* LEFT MAIN CONTENT */}
        <div className="flex-1">
          

          <p className="text-gray-600 mb-3 text-sm">
            Tin tức mới nhất trong ngày, cập nhật liên tục 24h. Từ nguồn báo
            chính thống như CNN, BBC, VOA,...
          </p>

          {/* Main News */}
          <div className="rounded-xl overflow-hidden shadow-md bg-white">
            <img
              src="https://cdn.tuoitre.vn/zoom/700_438/2025/11/10/nvidia-ai-scholarships.jpg"
              alt="Main article"
              className="w-full h-[360px] object-cover"
            />
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Nvidia commits $1M in AI scholarships to Vietnamese students
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="font-semibold">TODAI</span> | 2025-11-11 | 👁
                165
              </p>
            </div>
          </div>

          {/* Small News Row */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {["TODAI", "CNN", "VOA", "BBC"].map((src, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-lg transition"
              >
                <img
                  src={`https://picsum.photos/300/200?random=${i + 1}`}
                  className="w-full h-[100px] object-cover"
                  alt="news"
                />
                <div className="p-2">
                  <span className="text-xs font-semibold text-indigo-600">
                    {src}
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    Sample article headline
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[260px]">
          <h3 className="font-semibold mb-2">Đọc báo theo chủ đề</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "Khoa học",
              "Du lịch",
              "Sức khỏe",
              "Thể thao",
              "Giải trí",
              "Học tập",
              "Kinh tế",
              "Văn hóa",
            ].map((tag, i) => (
              <span
                key={i}
                className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-semibold mb-2">Học tiếng Anh với Video</h3>
          <div className="bg-white rounded-xl shadow-sm p-3">
            <img
              src="https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg"
              className="w-full rounded-md"
              alt="Video thumbnail"
            />
            <p className="text-sm mt-2 font-medium text-gray-700">
              Online Marketing 101
            </p>
            <span className="text-xs text-gray-500">
              1:05 phút • 20,298 lượt xem
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
