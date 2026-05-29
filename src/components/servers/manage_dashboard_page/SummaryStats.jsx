import SummaryCard from "@/components/servers/manage_dashboard_page/SummaryCard";
import {
  BookOpen,
  Video,
  Layers,
  Database,
  User,
  Shield,
  GraduationCap,
} from "lucide-react";

const SummaryStats = ({ data }) => {
  return (
    <div className="grid gap-5 mb-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <SummaryCard
        title="Active Admins"
        value={data?.total_admins ?? data?.totalAdmins}
        redirectTo="/server/admin"
        icon={Shield}
        colorClass="text-red-600 dark:text-red-400"
        bgClass="bg-red-50 dark:bg-red-900/20"
      />
      <SummaryCard
        title="Active Users"
        value={data?.total_users ?? data?.totalUsers}
        redirectTo="/server/user"
        icon={User}
        colorClass="text-indigo-600 dark:text-indigo-400"
        bgClass="bg-indigo-50 dark:bg-indigo-900/20"
      />
      <SummaryCard
        title="Total Articles"
        value={data?.total_articles ?? data?.totalArticles}
        redirectTo="/server/article"
        icon={BookOpen}
        colorClass="text-amber-600 dark:text-amber-400"
        bgClass="bg-amber-50 dark:bg-amber-900/20"
      />
      <SummaryCard
        title="Videos Available"
        value={data?.total_videos ?? data?.totalVideos}
        redirectTo="/server/video"
        icon={Video}
        colorClass="text-emerald-600 dark:text-emerald-400"
        bgClass="bg-emerald-50 dark:bg-emerald-900/20"
      />
      <SummaryCard
        title="Vocab Decks"
        value={data?.total_vocabulary_decks ?? data?.totalVocabularyDecks}
        redirectTo="/server/vocab-deck"
        icon={Layers}
        colorClass="text-blue-600 dark:text-blue-400"
        bgClass="bg-blue-50 dark:bg-blue-900/20"
      />
      <SummaryCard
        title="Dictionary Words"
        value={data?.total_dictionary_words ?? data?.totalDictionaryWords}
        redirectTo="/server/dictionary"
        icon={Database}
        colorClass="text-purple-600 dark:text-purple-400"
        bgClass="bg-purple-50 dark:bg-purple-900/20"
      />
      <SummaryCard
        title="TOEIC Practice Tests"
        value={data?.total_toeic_test ?? data?.totalToeicTest}
        redirectTo="/server/toeic-test"
        icon={GraduationCap}
        colorClass="text-cyan-600 dark:text-cyan-400"
        bgClass="bg-cyan-50 dark:bg-cyan-900/20"
      />
    </div>
  );
};

export default SummaryStats;
