// src/components/dictionary/SearchHistory.jsx
import React, { useEffect, useState } from "react";
import { Clock, Trash2, Hash } from "lucide-react";

const SearchHistory = ({ onSelectWord }) => {
  const [history, setHistory] = useState([]);

  // Load history từ LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("dict_history");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleDelete = (wordToDelete, e) => {
    e.stopPropagation();
    const newHistory = history.filter((w) => w !== wordToDelete);
    setHistory(newHistory);
    localStorage.setItem("dict_history", JSON.stringify(newHistory));
  };

  return (
    <div className="space-y-6">
      {/* History Section */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-neutral-700 font-bold pb-2 border-b border-neutral-100">
          <Clock size={18} />
          <h3>Lịch sử tra cứu</h3>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-neutral-400 italic">Chưa có lịch sử</p>
        ) : (
          <ul className="space-y-1">
            {history.slice(0, 10).map((word, idx) => (
              <li
                key={idx}
                onClick={() => onSelectWord(word)}
                className="group flex justify-between items-center p-2 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors text-sm text-neutral-600"
              >
                <span>{word}</span>
                <button
                  onClick={(e) => handleDelete(word, e)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Suggestion / Related (Demo UI) */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-neutral-700 font-bold pb-2 border-b border-neutral-100">
          <Hash size={18} />
          <h3>Từ liên quan</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Logic này sẽ nhận từ props real data sau */}
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-100">
            education
          </span>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-100">
            school
          </span>
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-100">
            learning
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
