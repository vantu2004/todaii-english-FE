import { useState } from "react";
import { Plus, Search } from "lucide-react";

const ToolBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // bạn có thể lọc tại client hoặc gọi API filter ở đây
  };

  const handleCreate = () => {
    toast("Open Create Admin modal (coming soon!)");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      {/* Ô tìm kiếm */}
      <div className="relative w-full sm:w-1/2">
        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by id, name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      {/* Nút tạo admin */}
      <button
        onClick={handleCreate}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Admin
      </button>
    </div>
  );
};

export default ToolBar;
