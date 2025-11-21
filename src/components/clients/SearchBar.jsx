import React, { useState, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";

const SearchBar = ({
  value = "",
  onSearch,
  onChangeSearch,
  placeholder = "Tìm kiếm...",
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value);

  // Sync state khi props thay đổi
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Xử lý khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch?.(inputValue);
    }
  };

  // Xử lý nút Xóa (Clear)
  const handleClear = () => {
    setInputValue("");
    onSearch?.(""); // Gọi search với rỗng hoặc logic tùy ý
    onChangeSearch?.("");
  };

  // Debounce: Tự động search sau khi ngừng gõ 0.4s
  useEffect(() => {
    if (!onChangeSearch) return;

    const delay = setTimeout(() => {
      onChangeSearch(inputValue);
    }, 400);

    return () => clearTimeout(delay);
  }, [inputValue, onChangeSearch]);

  return (
    <div className={`w-full relative group ${className}`}>
      {/* Icon Search bên trái */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-600 transition-colors pointer-events-none">
        <Search size={20} />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`
          w-full pl-12 
          ${!onChangeSearch ? "pr-14" : "pr-10"} 
          py-3.5 
          bg-white border border-neutral-200 
          rounded-full shadow-sm
          text-neutral-900 text-sm font-medium placeholder:text-neutral-400
          transition-all duration-200 ease-in-out
          
          focus:outline-none 
          focus:border-neutral-400 
          focus:ring-4 focus:ring-neutral-100
          
          hover:border-neutral-300
        `}
      />

      {/* Right Actions Container */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {/* Button Clear (Chỉ hiện khi có text) */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
            title="Xóa tìm kiếm"
          >
            <X size={16} />
          </button>
        )}

        {/* Button Search (Chỉ hiện ở chế độ Manual Search - không có onChangeSearch) */}
        {!onChangeSearch && (
          <button
            onClick={() => onSearch?.(inputValue)}
            className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all shadow-sm"
            title="Tìm kiếm"
          >
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
