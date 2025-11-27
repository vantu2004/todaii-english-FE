import React from "react";
import { BookOpen, Signal, Layers, Clock } from "lucide-react";
import { formatISODate } from "../../../utils/FormatDate";

const DeckCard = ({ deck }) => {
  // Helper style cho CEFR Badge
  const getLevelStyle = (level) => {
    switch (level) {
      case "A1":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "A2":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "B1":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "B2":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "C1":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "C2":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full cursor-pointer">
      {/* Card Header / Abstract Pattern */}
      <div className="h-28 bg-neutral-50 border-b border-neutral-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* CEFR Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border shadow-sm ${getLevelStyle(
              deck.cefr_level
            )}`}
          >
            {deck.cefr_level}
          </span>
        </div>

        <div className="absolute top-4 right-4 text-neutral-300 group-hover:text-indigo-500 transition-colors duration-300">
          <BookOpen size={24} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {deck.name}
        </h3>

        <p className="text-sm text-neutral-500 mb-4 line-clamp-3 flex-1">
          {deck.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs font-medium text-neutral-400 pt-4 border-t border-neutral-50">
          <div className="flex items-center gap-1.5">
            <Layers size={14} />
            {/* Giả sử API trả về số lượng từ trong field word_count hoặc words.length */}
            <span>{deck.words?.length || 0} từ</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{formatISODate(deck.updated_at || deck.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckCard;
