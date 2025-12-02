import SummaryCard from "../../../components/servers/manage_dashboard_page/SummaryCard";
import { BookOpen, Video, Layers, Database, User, Shield } from "lucide-react";

const SummaryStats = ({ data }) => {
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
      <SummaryCard
        title="Active Admins"
        value={data?.admin_count}
        redirectTo="/server/admin"
        icon={Shield}
        colorClass="text-red-500"
        bgClass="bg-red-100 dark:bg-red-900/30"
      />
      <SummaryCard
        title="Active Users"
        value={data?.user_count}
        redirectTo="/server/user"
        icon={User}
        colorClass="text-indigo-500"
        bgClass="bg-indigo-100 dark:bg-indigo-900/30"
      />
      <SummaryCard
        title="Total Articles"
        value={data?.article_count}
        redirectTo="/server/article"
        icon={BookOpen}
        colorClass="text-orange-500"
        bgClass="bg-orange-100 dark:bg-orange-900/30"
      />
      <SummaryCard
        title="Videos Available"
        value={data?.video_count}
        redirectTo="/server/video"
        icon={Video}
        colorClass="text-green-500"
        bgClass="bg-green-100 dark:bg-green-900/30"
      />
      <SummaryCard
        title="Vocab Decks"
        value={data?.vocab_deck_count}
        redirectTo="/server/vocab-deck"
        icon={Layers}
        colorClass="text-blue-500"
        bgClass="bg-blue-100 dark:bg-blue-900/30"
      />
      <SummaryCard
        title="Dictionary Words"
        value={data?.dictionary_word_count}
        redirectTo="/server/dictionary"
        icon={Database}
        colorClass="text-purple-500"
        bgClass="bg-purple-100 dark:bg-purple-900/30"
      />
    </div>
  );
};

export default SummaryStats;
