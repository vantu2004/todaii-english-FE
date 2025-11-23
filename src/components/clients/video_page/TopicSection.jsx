import { ChevronRight } from "lucide-react";

const TopicSection = ({ topics }) => (
  <section className="px-6 md:px-12 py-10 bg-[#0f1014]">
    <h3 className="text-xl font-bold text-white mb-6">Bạn đang quan tâm gì?</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {topics.map((topic) => (
        <div
          key={topic.id}
          className={`relative h-24 rounded-lg bg-gradient-to-br ${topic.color} p-4 flex flex-col justify-end cursor-pointer hover:opacity-90 transition-transform hover:-translate-y-1 shadow-lg`}
        >
          <h4 className="text-white font-bold text-md leading-tight">
            {topic.name}
          </h4>
          <div className="flex items-center gap-1 text-white/70 text-[10px] mt-1">
            <span>Xem chủ đề</span> <ChevronRight size={10} />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default TopicSection;
