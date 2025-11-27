import React, { useEffect, useState } from "react";
import { BarChart3, Layers, Filter, X } from "lucide-react";
import { getVocabGroups } from "../../../api/clients/vocabGroupApi"; // Import API của bạn
import { logError } from "../../../utils/LogError";

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const VocabFilterSidebar = ({ query, updateQuery }) => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getVocabGroups();
        setGroups(res || []);
      } catch (err) {
        logError(err);
      }
    };

    fetchGroups();
  }, []);

  const handleToggle = (key, value) => {
    const newValue = query[key] === value ? "" : value;
    updateQuery({ [key]: newValue, page: 1 });
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6 sticky top-24">
      {/* Clear Filter Button (Chỉ hiện khi có filter) */}
      {(query.cefrLevel || query.alias) && (
        <button
          onClick={() => updateQuery({ cefrLevel: "", alias: "", page: 1 })}
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
              onClick={() => handleToggle("cefrLevel", level)}
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

      {/* 2. Topic Groups Filter */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-neutral-900">
          <Layers size={18} className="text-neutral-400" />
          <h3 className="font-bold">Chủ đề</h3>
        </div>
        <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
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
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => handleToggle("alias", group.alias)}
              className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${
                query.alias === group.alias
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <span className="truncate">{group.name}</span>
              {query.alias === group.alias && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default VocabFilterSidebar;
