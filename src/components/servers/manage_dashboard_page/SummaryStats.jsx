import SummaryCard from "@/components/servers/manage_dashboard_page/SummaryCard";
import { BookOpen, Video, Layers, Database, User, Shield } from "lucide-react";

const SummaryStats = ({ data }) => {
  return (
    <div className="grid gap-4 mb-8 md:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        title="Active Admins"
        value={data?.admin_count}
        redirectTo="/server/admin"
        icon={Shield}
        colorClass="text-red-600/80 dark:text-red-400"
        bgClass="bg-red-50 dark:bg-red-900/20"
      />
      <SummaryCard
        title="Active Users"
        value={data?.user_count}
        redirectTo="/server/user"
        icon={User}
        colorClass="text-indigo-600/80 dark:text-indigo-400"
        bgClass="bg-indigo-50 dark:bg-indigo-900/20"
      />
      <SummaryCard
        title="Total Articles"
        value={data?.article_count}
        redirectTo="/server/article"
        icon={BookOpen}
        colorClass="text-amber-600/80 dark:text-amber-400"
        bgClass="bg-amber-50 dark:bg-amber-900/20"
      />
      <SummaryCard
        title="Videos Available"
        value={data?.video_count}
        redirectTo="/server/video"
        icon={Video}
        colorClass="text-emerald-600/80 dark:text-emerald-400"
        bgClass="bg-emerald-50 dark:bg-emerald-900/20"
      />
      <SummaryCard
        title="Vocab Decks"
        value={data?.vocab_deck_count}
        redirectTo="/server/vocab-deck"
        icon={Layers}
        colorClass="text-blue-600/80 dark:text-blue-400"
        bgClass="bg-blue-50 dark:bg-blue-900/20"
      />
      <SummaryCard
        title="Dictionary Words"
        value={data?.dictionary_word_count}
        redirectTo="/server/dictionary"
        icon={Database}
        colorClass="text-purple-600/80 dark:text-purple-400"
        bgClass="bg-purple-50 dark:bg-purple-900/20"
      />
    </div>
  );
};

export default SummaryStats;
