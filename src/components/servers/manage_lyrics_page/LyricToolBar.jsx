import { useState, useEffect } from "react";
import { Eye, MoveLeft, Plus, Search, Trash2, Upload } from "lucide-react";

const ToolBar = ({
  updateQuery,
  setIsPreviewModalOpen,
  setIsUploadModalOpen,
  setIsCreateModalOpen,
  setIsDeleteAllModalOpen,
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
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-shadow"
        />
      </div>

      {/* Buttons container */}
      <div className="flex flex-wrap items-center gap-3 ml-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <MoveLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          onClick={() => setIsPreviewModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <Eye className="w-5 h-5" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <Upload className="w-5 h-5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Create New</span>
        </button>

        <button
          onClick={() => setIsDeleteAllModalOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:inline">Delete All</span>
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
