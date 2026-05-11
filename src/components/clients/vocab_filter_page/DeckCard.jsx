import { BookOpen, Layers, Clock } from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";
import { Link } from "react-router-dom";

const DeckCard = ({ deck }) => {
  const getLevelStyle = (level) => {
    switch (level) {
      case "A1":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "A2":
        return "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800";
      case "B1":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "B2":
        return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
      case "C1":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800";
      case "C2":
        return "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      default:
        return "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-400 border-gray-200 dark:border-neutral-700";
    }
  };

  const getHeaderStyle = (level) => {
    switch (level) {
      case "A1":
        return "bg-emerald-50 dark:bg-emerald-900/20";
      case "A2":
        return "bg-teal-50 dark:bg-teal-900/20";
      case "B1":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "B2":
        return "bg-indigo-50 dark:bg-indigo-900/20";
      case "C1":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "C2":
        return "bg-rose-50 dark:bg-rose-900/20";
      default:
        return "bg-neutral-50 dark:bg-neutral-800/50";
    }
  };

  return (
    <Link
      to={`/client/vocabulary/${deck.id}`}
      className="group flex flex-col bg-white dark:bg-neutral-900/60 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full cursor-pointer"
    >
      {/* Card Header / Abstract Pattern */}
      <div className={`h-28 border-b border-neutral-100 dark:border-neutral-800 relative overflow-hidden transition-colors ${getHeaderStyle(deck.cefr_level)}`}>
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

        <div className="absolute top-4 right-4 text-neutral-300 dark:text-neutral-600 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-300">
          <BookOpen size={24} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {deck.name}
        </h3>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-3 flex-1">
          {deck.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs font-medium text-neutral-400 dark:text-neutral-500 pt-4 border-t border-neutral-50 dark:border-neutral-800">
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
    </Link>
  );
};

export default DeckCard;
