// src/components/clients/video/VideoFilterSidebar.jsx
import { BarChart3, Layers, Eye } from "lucide-react";

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const VIEW_RANGES = [
  { label: "Tất cả", value: 0 },
  { label: "> 1.000 views", value: 1000 },
  { label: "> 10.000 views", value: 10000 },
  { label: "> 100.000 views", value: 100000 },
];

const VideoFilterSidebar = ({ query, updateQuery, topics }) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-8 sticky top-24">
      {/* CEFR Level Filter */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-neutral-400" />
          <h3 className="font-bold text-neutral-900">Trình độ</h3>
        </div>
        <div className="flex flex-wrap gap-2">
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
                w-10 h-10 rounded-xl text-sm font-bold transition-all
                ${
                  query.cefrLevel === level
                    ? "bg-neutral-900 text-white shadow-md scale-105"
                    : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                }
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Filter */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Layers size={18} className="text-neutral-400" />
          <h3 className="font-bold text-neutral-900">Chủ đề</h3>
        </div>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          <button
            onClick={() => updateQuery({ alias: "", page: 1 })}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
              onClick={() => updateQuery({ alias: t.alias, page: 1 })}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                query.alias === t.alias
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Min Views Filter */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={18} className="text-neutral-400" />
          <h3 className="font-bold text-neutral-900">Lượt xem</h3>
        </div>
        <div className="space-y-2">
          {VIEW_RANGES.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  query.minViews === range.value
                    ? "border-neutral-900"
                    : "border-neutral-300 group-hover:border-neutral-400"
                }`}
              >
                {query.minViews === range.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                )}
              </div>
              <input
                type="radio"
                name="minViews"
                className="hidden"
                checked={query.minViews === range.value}
                onChange={() => updateQuery({ minViews: range.value, page: 1 })}
              />
              <span
                className={`text-sm ${
                  query.minViews === range.value
                    ? "text-neutral-900 font-medium"
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
