import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  FileText,
  Layers,
  Languages,
  GraduationCap,
  Video,
} from "lucide-react";

const SummaryCard = ({ label, value, icon: Icon, loading, onClick }) => {
  if (loading) {
    return (
      <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg animate-pulse">
        <div className="flex justify-between items-start mb-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="w-8 h-8 rounded bg-gray-200 dark:bg-gray-800"></div>
        </div>
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-between cursor-pointer hover:border-gray-450 hover:bg-gray-50/50 dark:hover:border-gray-700 dark:hover:bg-gray-800/35 transition-all select-none group"
    >
      <div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-300">
          {label}
        </span>
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">
          {typeof value === "number" ? value.toLocaleString() : value || 0}
        </span>
      </div>
      <div className="p-2.5 bg-gray-50 dark:bg-gray-850 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:text-gray-700 dark:group-hover:text-white group-hover:bg-gray-100 dark:group-hover:bg-gray-800 transition-colors">
        <Icon size={20} />
      </div>
    </div>
  );
};

const SummaryCards = ({ summaryData, loading }) => {
  const navigate = useNavigate();

  const cards = [
    {
      label: "Admins",
      value: summaryData?.total_admins,
      icon: Shield,
      to: "/server/admin",
    },
    {
      label: "Users",
      value: summaryData?.total_users,
      icon: Users,
      to: "/server/user",
    },
    {
      label: "Articles",
      value: summaryData?.total_articles,
      icon: FileText,
      to: "/server/article",
    },
    {
      label: "Vocab Decks",
      value: summaryData?.total_vocabulary_decks,
      icon: Layers,
      to: "/server/vocab-deck",
    },
    {
      label: "Dict Words",
      value: summaryData?.total_dictionary_words,
      icon: Languages,
      to: "/server/dictionary",
    },
    {
      label: "Toeic Tests",
      value: summaryData?.total_toeic_test,
      icon: GraduationCap,
      to: "/server/toeic-test",
    },
    {
      label: "Videos",
      value: summaryData?.total_videos,
      icon: Video,
      to: "/server/video",
    },
  ];

  return (
    <div className="mb-6">
      {/* 7 Cards in a single grid-cols-4 layout to enforce equal width wrapping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <SummaryCard
            key={idx}
            label={card.label}
            value={card.value}
            icon={card.icon}
            loading={loading}
            onClick={() => card.to && navigate(card.to)}
          />
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
