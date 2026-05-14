import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";

const ToolBar = ({ updateQuery, setIsModalOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      updateQuery({ keyword: searchTerm, page: 1 });
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:focus:ring-white/10 dark:text-white placeholder:text-gray-400"
        />
      </div>

      {/* Create Button */}
      {setIsModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white dark:text-gray-900 bg-gray-900 dark:bg-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
      )}
    </div>
  );
};

export default ToolBar;
