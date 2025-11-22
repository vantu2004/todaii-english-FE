import { useState, useEffect } from "react";
import { ChevronDown, RotateCcw, Check } from "lucide-react";
import { getAllSources } from "../../../api/clients/articleApi";
import { getAllTopics } from "../../../api/clients/topicApi";
import { logError } from "../../../utils/LogError";

const ArticleFilter = ({ query, updateQuery, onApply, isMobile = false }) => {
  const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const [sources, setSources] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sourceRes, topicRes] = await Promise.all([
          getAllSources(),
          getAllTopics(),
        ]);
        setSources(sourceRes || []);
        setTopics(topicRes || []);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sourceOptions = [
    { value: "", label: "Tất cả nguồn" },
    ...sources.map((s) => ({ value: s, label: s })),
  ];

  const topicOptions = [
    { value: "", label: "Tất cả chủ đề" },
    ...topics.map((t) => ({ value: t.alias, label: t.name })),
  ];

  const [expandedSections, setExpandedSections] = useState({
    source: true,
    topic: false,
    cefr: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      source: section === "source" ? !prev.source : false,
      topic: section === "topic" ? !prev.topic : false,
      cefr: section === "cefr" ? !prev.cefr : false,
    }));
  };

  const hasActiveFilters = query.sourceName || query.alias || query.cefrLevel;

  const resetFilters = () => {
    updateQuery({
      sourceName: "",
      alias: "",
      cefrLevel: "",
      page: 1,
    });
  };

  // CEFR level colors
  const getLevelColor = (level) => {
    const colors = {
      A1: "bg-emerald-500",
      A2: "bg-teal-500",
      B1: "bg-sky-500",
      B2: "bg-indigo-500",
      C1: "bg-violet-500",
      C2: "bg-purple-500",
    };
    return colors[level] || "bg-neutral-400";
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-neutral-100 overflow-hidden ${
        isMobile ? "" : "shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      }`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Bộ lọc</h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <RotateCcw size={12} />
            Đặt lại
          </button>
        )}
      </div>

      <div className="p-4 space-y-1">
        {/* Source Filter */}
        <div className="border-b border-neutral-100 pb-3">
          <button
            onClick={() => toggleSection("source")}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="text-sm font-medium text-neutral-700">
              Nguồn tin
            </span>
            <ChevronDown
              size={16}
              className={`text-neutral-400 transition-transform duration-200 ${
                expandedSections.source ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`space-y-1  overflow-y-auto transition-all duration-200 ${
              expandedSections.source
                ? "max-h-64 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            {sourceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  updateQuery({ sourceName: option.value, page: 1 })
                }
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                  query.sourceName === option.value
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {option.label}
                {query.sourceName === option.value && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Filter */}
        <div className="border-b border-neutral-100 py-3">
          <button
            onClick={() => toggleSection("topic")}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="text-sm font-medium text-neutral-700">Chủ đề</span>
            <ChevronDown
              size={16}
              className={`text-neutral-400 transition-transform duration-200 ${
                expandedSections.topic ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`space-y-1 overflow-y-auto transition-all duration-200 ${
              expandedSections.topic
                ? "max-h-48 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            {topicOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateQuery({ alias: option.value, page: 1 })}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                  query.alias === option.value
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {option.label}
                {query.alias === option.value && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* CEFR Level Filter */}
        <div className="pt-3">
          <button
            onClick={() => toggleSection("cefr")}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <span className="text-sm font-medium text-neutral-700">
              Trình độ CEFR
            </span>
            <ChevronDown
              size={16}
              className={`text-neutral-400 transition-transform duration-200 ${
                expandedSections.cefr ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-200 ${
              expandedSections.cefr
                ? "max-h-64 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid grid-cols-3 gap-2 mb-2">
              {cefrLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => updateQuery({ cefrLevel: level, page: 1 })}
                  className={`relative flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    query.cefrLevel === level
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      query.cefrLevel === level
                        ? "bg-white"
                        : getLevelColor(level)
                    }`}
                  />
                  {level}
                </button>
              ))}
            </div>

            {/* Clear CEFR */}
            <button
              onClick={() => updateQuery({ cefrLevel: "", page: 1 })}
              className={`w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                query.cefrLevel === ""
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              Tất cả trình độ
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="p-4 border-t border-neutral-100">
          <button
            onClick={onApply}
            className="w-full py-3 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleFilter;
