import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft, FileQuestion } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-5 text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none animate-pulse">
          404
        </div>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Không tìm thấy trang
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
            không khả dụng.
          </p>
          <p className="text-md text-gray-500">
            Đừng lo lắng, chúng tôi sẽ giúp bạn quay lại đúng hướng!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Về Trang Chủ
          </button>

          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer group flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Quay Lại
          </button>
        </div>


        {/* Popular Links */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Trang phổ biến:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              Trang chủ
            </button>
            <button
              onClick={() => navigate("/articles")}
              className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
            >
              Bài viết
            </button>
            <button
              onClick={() => navigate("/saved-articles")}
              className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
            >
              Đã lưu
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
            >
              Giới thiệu
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="fixed bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

export default PageNotFound;
