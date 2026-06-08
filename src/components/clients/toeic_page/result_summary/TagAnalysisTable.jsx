import React from "react";

const TagAnalysisTable = ({
  tags,
  tagQuestions,
  answersMap,
  flatQuestions,
  onQuestionClick,
}) => {
  // Build a helper mapping of questionId -> questionNumber
  const questionNumberMap = {};
  flatQuestions.forEach((q) => {
    questionNumberMap[q.id] = q.questionNumber;
  });

  // Calculate statistics for each tag
  const tagStats = tags
    .map((tag) => {
      const qIds = tagQuestions[tag.id] || [];

      // Only count questions that were part of this session (i.e. in flatQuestions / user answers)
      const sessionQIds = qIds.filter(
        (qId) => questionNumberMap[qId] !== undefined,
      );

      let correct = 0;
      let incorrect = 0;
      let skipped = 0;

      sessionQIds.forEach((qId) => {
        const ans = answersMap[qId];
        const status = ans ? ans.status : 2; // 1: correct, 0: incorrect, 2: skipped
        if (status === 1) correct++;
        else if (status === 0) incorrect++;
        else skipped++;
      });

      const total = sessionQIds.length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

      return {
        tag,
        qIds: sessionQIds,
        correct,
        incorrect,
        skipped,
        total,
        accuracy,
      };
    })
    .filter((stat) => stat.total > 0); // Hide tags that were not in this session's parts

  if (tagStats.length === 0) {
    return (
      <div className="py-2 text-center text-neutral-500 dark:text-neutral-450 italic text-[11px]">
        Không có dữ liệu phân tích tag cho phần thi này.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-100 dark:bg-neutral-800">
              <tr>
                <th
                  scope="col"
                  className="px-2.5 py-1.5 text-left text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Phân loại câu hỏi
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-1.5 text-center text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Đúng
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-1.5 text-center text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Sai
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-1.5 text-center text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Bỏ qua
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-1.5 text-center text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Chính xác
                </th>
                <th
                  scope="col"
                  className="px-2.5 py-1.5 text-left text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Danh sách câu hỏi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
              {tagStats.map(
                ({
                  tag,
                  qIds,
                  correct,
                  incorrect,
                  skipped,
                  total,
                  accuracy,
                }) => (
                  <tr
                    key={tag.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-colors"
                  >
                    {/* Tag Name */}
                    <td className="px-2.5 py-1.5 whitespace-nowrap text-xs text-neutral-900 dark:text-neutral-200 font-bold">
                      #{tag.name}
                    </td>

                    {/* Correct */}
                    <td className="px-2.5 py-1.5 whitespace-nowrap text-center text-xs text-emerald-600 dark:text-emerald-450 font-bold">
                      {correct}
                    </td>

                    {/* Incorrect */}
                    <td className="px-2.5 py-1.5 whitespace-nowrap text-center text-xs text-rose-600 dark:text-rose-400 font-bold">
                      {incorrect}
                    </td>

                    {/* Skipped */}
                    <td className="px-2.5 py-1.5 whitespace-nowrap text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {skipped}
                    </td>

                    {/* Accuracy */}
                    <td className="px-2.5 py-1.5 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-500 text-white border border-amber-600">
                        {accuracy}%
                      </span>
                    </td>

                    {/* Question Badges List */}
                    <td className="px-2.5 py-1.5 text-xs">
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {qIds.map((qId) => {
                          const qNum = questionNumberMap[qId];
                          const ans = answersMap[qId];
                          const status = ans ? ans.status : 2;

                          let badgeStyle = "";
                          if (status === 1) {
                            // Correct
                            badgeStyle =
                              "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-350";
                          } else if (status === 0) {
                            // Incorrect
                            badgeStyle =
                              "bg-rose-50 dark:bg-rose-955/20 border-rose-300 dark:border-rose-800/40 text-rose-800 dark:text-rose-350";
                          } else {
                            // Skipped
                            badgeStyle =
                              "bg-neutral-50 dark:bg-neutral-800/30 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400";
                          }

                          return (
                            <button
                              key={qId}
                              type="button"
                              onClick={() =>
                                onQuestionClick && onQuestionClick(qId)
                              }
                              className={`inline-flex items-center justify-center w-5.5 h-5.5 text-[9.5px] font-bold rounded border cursor-pointer hover:scale-105 active:scale-95 transition-all ${badgeStyle}`}
                              title={`Click để xem câu ${qNum}`}
                            >
                              {qNum}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TagAnalysisTable;
