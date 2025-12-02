import SummaryCard from "../../../components/servers/manage_dashboard_page/SummaryCard";
import { BookOpen, Video, Layers, Database } from "lucide-react";

const SummaryStats = ({ data }) => {
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Total Articles"
        value={data?.article_count}
        icon={BookOpen}
        colorClass="text-orange-500"
        bgClass="bg-orange-100 dark:bg-orange-900/30"
      />
      <SummaryCard
        title="Videos Available"
        value={data?.video_count}
        icon={Video}
        colorClass="text-green-500"
        bgClass="bg-green-100 dark:bg-green-900/30"
      />
      <SummaryCard
        title="Vocab Decks"
        value={data?.vocab_deck_count}
        icon={Layers}
        colorClass="text-blue-500"
        bgClass="bg-blue-100 dark:bg-blue-900/30"
      />
      <SummaryCard
        title="Dictionary Words"
        value={data?.dictionary_word_count}
        icon={Database}
        colorClass="text-purple-500"
        bgClass="bg-purple-100 dark:bg-purple-900/30"
      />
    </div>
  );
};

export default SummaryStats;
