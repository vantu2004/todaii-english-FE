import React, { useMemo } from "react";
import { Map } from "lucide-react";

const PARTS = [
  { id: 1, name: "Part 1" },
  { id: 2, name: "Part 2" },
  { id: 3, name: "Part 3" },
  { id: 4, name: "Part 4" },
  { id: 5, name: "Part 5" },
  { id: 6, name: "Part 6" },
  { id: 7, name: "Part 7" },
];

// answers shape: { [qId]: { user_choice, correct_ans, is_marked, status } }
// status: 1=đúng, 0=sai, 2=bỏ qua
const QuestionNavigatorReview = ({ questions, answers, onNavigate }) => {
  const groupedByPart = useMemo(() => {
    const groups = {};
    questions.forEach((q) => {
      if (!groups[q.partNumber]) groups[q.partNumber] = [];
      groups[q.partNumber].push(q);
    });
    return groups;
  }, [questions]);

  const totalCorrect = useMemo(
    () => questions.filter((q) => answers[q.id]?.status === 1).length,
    [questions, answers],
  );
  const totalWrong = useMemo(
    () => questions.filter((q) => answers[q.id]?.status === 0).length,
    [questions, answers],
  );
  const totalSkipped = useMemo(
    () =>
      questions.filter((q) => answers[q.id]?.status === 2 || !answers[q.id])
        .length,
    [questions, answers],
  );

  return (
    <div className="flex flex-col h-full text-xs sm:text-sm">
      {/* Header stats */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <Map size={14} className="text-neutral-500" />
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
            Bản đồ câu hỏi
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="flex flex-col items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/40">
            <span className="text-base font-bold text-green-600 dark:text-green-400">
              {totalCorrect}
            </span>
            <span className="text-[10px] text-green-600/70 dark:text-green-500/80">
              Đúng
            </span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40">
            <span className="text-base font-bold text-red-600 dark:text-red-400">
              {totalWrong}
            </span>
            <span className="text-[10px] text-red-600/70 dark:text-red-500/80">
              Sai
            </span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
            <span className="text-base font-bold text-neutral-500 dark:text-neutral-400">
              {totalSkipped}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Bỏ qua
            </span>
          </div>
        </div>
      </div>

      {/* Question grid by part */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {Object.entries(groupedByPart).map(([partId, partQuestions]) => {
          const partInfo = PARTS.find((p) => p.id === Number(partId));
          const correctInPart = partQuestions.filter(
            (q) => answers[q.id]?.status === 1,
          ).length;

          return (
            <div key={partId}>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  {partInfo?.name || `Part ${partId}`}
                </h4>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                  {correctInPart}/{partQuestions.length}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-1">
                {partQuestions.map((q) => {
                  const ans = answers[q.id];
                  const status = ans?.status ?? 2;
                  const isMarked = ans?.is_marked ?? false;

                  let btnClass =
                    "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500";
                  if (isMarked) {
                    btnClass = "bg-amber-500 text-white";
                  } else if (status === 1) {
                    btnClass = "bg-green-500 text-white";
                  } else if (status === 0) {
                    btnClass = "bg-red-500 text-white";
                  }
                  // status === 2 = bỏ qua → neutral

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onNavigate(q.id)}
                      className={`w-full aspect-square rounded text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all hover:opacity-80 ${btnClass}`}
                      title={`Câu ${q.questionNumber}`}
                    >
                      {q.questionNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-wrap gap-2.5 text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-green-500" />
            <span>Đúng</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-red-500" />
            <span>Sai</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-amber-500" />
            <span>Đánh dấu</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-neutral-200 dark:bg-neutral-700" />
            <span>Bỏ qua</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigatorReview;
