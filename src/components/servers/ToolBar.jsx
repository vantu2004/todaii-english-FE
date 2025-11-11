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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md"
        />
      </div>

      {/* Create Button */}
      {setIsModalOpen && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create New
        </button>
      )}
    </div>
  );
};

export default ToolBar;
