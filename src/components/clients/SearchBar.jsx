import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  value = "",
  onSearch,
  onChangeSearch,
  placeholder = "Search...",
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value); // sync when parent changes
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch?.(inputValue);
    }
  };
  // Debounce live search
  useEffect(() => {
    if (!onChangeSearch) return;

    const delay = setTimeout(() => {
      onChangeSearch(inputValue);
    }, 400); // 0.4s debounce

    return () => clearTimeout(delay);
  }, [inputValue]);

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
                     focus:outline-none focus:border-blue-500 focus:ring-4 
                     focus:ring-blue-100 transition-all duration-200
                     hover:border-gray-300"
        />

        {!onChangeSearch && (
          <button
            onClick={() => onSearch?.(inputValue)}
            className="cursor-pointer absolute right-2 px-6 py-2.5
                     bg-blue-600 text-white rounded-xl"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
