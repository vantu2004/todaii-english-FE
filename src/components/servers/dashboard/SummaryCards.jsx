import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const GroupCard = ({ title, icon: Icon, items, loading, onNavigate }) => {
  if (loading) {
    return (
      <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg animate-pulse min-h-[140px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-850 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-850 rounded-lg"></div>
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-850 rounded w-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-850 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </h4>
        <div className="p-2 bg-gray-50 dark:bg-gray-850 rounded-lg text-gray-400 border border-gray-100 dark:border-gray-800 flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => item.to && onNavigate(item.to)}
            className="flex items-center justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer group transition-colors"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white transition-colors flex items-center gap-1.5">
              {item.label}
              <ChevronRight
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"
              />
            </span>
            <span className="text-base font-semibold text-gray-950 dark:text-white">
              {typeof item.value === "number"
                ? item.value.toLocaleString()
                : item.value || 0}
            </span>
          </div>
        ))}
        {/* Spacing placeholder for single item groups to maintain consistent card height */}
        {items.length === 1 && (
          <div className="py-2 px-3 opacity-0 select-none pointer-events-none">
            <span className="text-sm">Placeholder</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCards = ({ summaryData, loading }) => {
  const navigate = useNavigate();

  const cardGroups = [
    {
      title: "Accounts",
      icon: Users,
      items: [
        {
          label: "Admins",
          value: summaryData?.total_admins,
          to: "/server/admin",
        },
        {
          label: "Users",
          value: summaryData?.total_users,
          to: "/server/user",
        },
      ],
    },
    {
      title: "Content",
      icon: FileText,
      items: [
        {
          label: "Articles",
          value: summaryData?.total_articles,
          to: "/server/article",
        },
        {
          label: "Videos",
          value: summaryData?.total_videos,
          to: "/server/video",
        },
      ],
    },
    {
      title: "Vocabulary",
      icon: BookOpen,
      items: [
        {
          label: "Vocab Decks",
          value: summaryData?.total_vocabulary_decks,
          to: "/server/vocab-deck",
        },
        {
          label: "Dict Words",
          value: summaryData?.total_dictionary_words,
          to: "/server/dictionary",
        },
      ],
    },
    {
      title: "Exams",
      icon: GraduationCap,
      items: [
        {
          label: "TOEIC Tests",
          value: summaryData?.total_toeic_test,
          to: "/server/toeic-test",
        },
      ],
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardGroups.map((group, idx) => (
          <GroupCard
            key={idx}
            title={group.title}
            icon={group.icon}
            items={group.items}
            loading={loading}
            onNavigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};

export default SummaryCards;
