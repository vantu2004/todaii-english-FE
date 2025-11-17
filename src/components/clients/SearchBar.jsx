import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ query, updateQuery, placeholder }) => {
  const [inputValue, setInputValue] = useState(query.keyword);

  const onSearchClick = () => {
    updateQuery({ keyword: inputValue, page: 1 });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchClick();
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3.5 text-base
                     bg-white border-2 border-gray-200
                     rounded-2xl shadow-sm
                     placeholder:text-gray-400
                     focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                     transition-all duration-200
                     hover:border-gray-300"
        />

        <button
          onClick={onSearchClick}
          className="absolute right-2 px-6 py-2.5
                     bg-gradient-to-r from-blue-600 to-blue-700
                     hover:from-blue-700 hover:to-blue-800
                     text-white font-medium rounded-xl
                     shadow-md hover:shadow-lg
                     transition-all duration-200
                     transform hover:scale-105 active:scale-95
                     flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Tìm</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
