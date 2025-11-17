import { useState, useEffect } from "react";
import { Eye, MoveLeft, Plus, Search, Trash2, Upload } from "lucide-react";

const ToolBar = ({
  updateQuery,
  setIsUploadModalOpen,
  setIsCreateModalOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      updateQuery({ keyword: searchTerm });
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md"
        />
      </div>

      {/* Buttons container */}
      <div className="flex flex-wrap items-center gap-3 ml-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-gray-700 bg-transparent rounded-xl border border-gray-300 hover:bg-orange-600 hover:text-white active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          <MoveLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-gray-700 bg-transparent rounded-xl border border-gray-300 hover:bg-green-600 hover:text-white active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          <Eye className="w-5 h-5" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-gray-700 bg-transparent rounded-xl border border-gray-300 hover:bg-yellow-500 hover:text-white active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          <Upload className="w-5 h-5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-gray-700 bg-transparent rounded-xl border border-gray-300 hover:bg-blue-600 hover:text-white active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create New</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm font-semibold text-gray-700 bg-transparent rounded-xl border border-gray-300 hover:bg-red-600 hover:text-white active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:inline">Delete All</span>
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
