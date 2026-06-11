import { useState, useEffect } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { formatDate } from "@/utils/FormatDate";

const DateRangePicker = ({
  startDate,
  endDate,
  onRangeChange,
  preset,
  setPreset,
  onRefresh,
  loading,
}) => {
  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);

  // Sync inputs with parent state when preset is updated
  useEffect(() => {
    setCustomStart(startDate);
    setCustomEnd(endDate);
  }, [startDate, endDate]);

  const handlePresetClick = (days) => {
    setPreset(String(days));
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    onRangeChange(formatDate(start), formatDate(end));
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    setPreset("custom");
    onRangeChange(customStart, customEnd);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handlePresetClick(7)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            preset === "7"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          7 Days
        </button>
        <button
          onClick={() => handlePresetClick(14)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            preset === "14"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          14 Days
        </button>
        <button
          onClick={() => handlePresetClick(30)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            preset === "30"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          30 Days
        </button>
        <button
          onClick={() => setPreset("custom")}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            preset === "custom"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Custom
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {preset === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
            />
            <span className="text-gray-400 dark:text-gray-600 text-xs">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
            />
            <button
              onClick={handleApplyCustom}
              className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {preset !== "custom" && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-lg text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={14} />
              <span>
                {startDate} to {endDate}
              </span>
            </div>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
