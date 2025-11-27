import { BarChart3, Layers, Eye, X, Filter } from "lucide-react";

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const VIEW_RANGES = [
  { label: "Tất cả", value: 0 },
  { label: "> 1.000 views", value: 1000 },
  { label: "> 10.000 views", value: 10000 },
  { label: "> 100.000 views", value: 100000 },
];

const VideoFilterSidebar = ({ query, updateQuery, topics }) => {
  // Kiểm tra xem có đang lọc gì không để hiện nút xóa
  const hasActiveFilter = query.cefrLevel || query.alias || query.minViews > 0;

  const handleClearFilters = () => {
    updateQuery({
      cefrLevel: "",
      alias: "",
      minViews: 0,
      page: 1,
    });
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6 sticky top-24">
      {/* Clear Filter Button (Chỉ hiện khi có filter) */}
      {hasActiveFilter && (
        <button
          onClick={handleClearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors mb-2"
        >
          <X size={14} /> Xóa tất cả bộ lọc
        </button>
      )}

      {/* 1. CEFR Level Filter */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-neutral-900">
          <BarChart3 size={18} className="text-neutral-400" />
          <h3 className="font-bold">Trình độ</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CEFR_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() =>
                updateQuery({
                  cefrLevel: query.cefrLevel === level ? "" : level,
                  page: 1,
                })
              }
              className={`
                py-2 rounded-xl text-sm font-bold transition-all border
                ${
                  query.cefrLevel === level
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                    : "bg-white text-neutral-600 border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50"
                }
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Topics Filter */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-neutral-900">
          <Layers size={18} className="text-neutral-400" />
          <h3 className="font-bold">Chủ đề</h3>
        </div>
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          <button
            onClick={() => updateQuery({ alias: "", page: 1 })}
            className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              query.alias === ""
                ? "bg-neutral-100 text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
          >
            Tất cả chủ đề
          </button>
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() =>
                updateQuery({
                  alias: query.alias === t.alias ? "" : t.alias, // Toggle logic
                  page: 1,
                })
              }
              className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${
                query.alias === t.alias
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <span className="truncate">{t.name}</span>
              {query.alias === t.alias && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Min Views Filter */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-neutral-900">
          <Eye size={18} className="text-neutral-400" />
          <h3 className="font-bold">Lượt xem tối thiểu</h3>
        </div>
        <div className="space-y-1">
          {VIEW_RANGES.map((range) => (
            <label
              key={range.value}
              className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all ${
                query.minViews === range.value
                  ? "bg-neutral-50"
                  : "hover:bg-neutral-50"
              }`}
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name="minViews"
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-neutral-300 checked:border-neutral-900 transition-all"
                  checked={query.minViews === range.value}
                  onChange={() =>
                    updateQuery({ minViews: range.value, page: 1 })
                  }
                />
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-neutral-900 opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span
                className={`text-sm ${
                  query.minViews === range.value
                    ? "text-neutral-900 font-bold"
                    : "text-neutral-600"
                }`}
              >
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default VideoFilterSidebar;
