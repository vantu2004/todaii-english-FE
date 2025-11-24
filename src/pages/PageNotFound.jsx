import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-white overflow-hidden flex items-center justify-center relative selection:bg-neutral-900 selection:text-white">
      {/* --- Background Decoration (Abstract Blobs) --- */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-3xl w-full px-6 text-center">
        {/* 1. Watermark 404 Layer */}
        <div className="relative">
          <h1 className="text-[150px] sm:text-[200px] md:text-[280px] font-black text-neutral-50 leading-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
            404
          </h1>

          {/* 2. Icon & Message Layer */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-neutral-50 rounded-3xl shadow-sm animate-bounce">
              <FileQuestion size={48} className="text-neutral-900" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">
            Trang không tồn tại
          </h2>

          <p className="text-base sm:text-lg text-neutral-500 max-w-lg mx-auto mb-10 leading-relaxed">
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có
            thể trang đã bị xóa hoặc đường dẫn không chính xác.
          </p>
        </div>

        {/* 3. Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Button Back */}
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto cursor-pointer group flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-neutral-700 rounded-full font-semibold border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Quay Lại
          </button>

          {/* Button Home */}
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto cursor-pointer group flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 text-white rounded-full font-semibold border border-transparent shadow-lg hover:bg-neutral-800 hover:-translate-y-1 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Về Trang Chủ
          </button>
        </div>
      </div>

      {/* Footer Copyright (Optional - neo dưới đáy) */}
      <div className="absolute bottom-8 text-xs text-neutral-400 font-medium">
        © Todaii English. All rights reserved.
      </div>
    </div>
  );
};

export default PageNotFound;
