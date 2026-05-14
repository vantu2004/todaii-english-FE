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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 focus:border-neutral-400 dark:text-white transition-shadow"
        />
      </div>

      {/* Create Button */}
      {setIsModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New
        </button>
      )}
    </div>
  );
};

export default ToolBar;
