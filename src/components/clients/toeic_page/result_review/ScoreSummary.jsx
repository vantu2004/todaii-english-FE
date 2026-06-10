import { CheckCircle2, XCircle, MinusCircle, Trophy } from "lucide-react";

const ScoreSummary = ({ session }) => {
  if (!session) return null;

  const total =
    (session.correct_count ?? 0) +
    (session.incorrect_count ?? 0) +
    (session.skipped_count ?? 0);
  const accuracy =
    total > 0 ? Math.round(((session.correct_count ?? 0) / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex flex-wrap items-center gap-4">
      {/* Total score */}
      {session.total_score != null && (
        <div className="flex items-center gap-2">
          <Trophy size={15} className="text-amber-500" />
          <span className="text-sm font-bold text-neutral-900 dark:text-white">
            {session.total_score}
            <span className="text-neutral-400 font-normal"> điểm</span>
          </span>
          {session.score_l != null && session.score_r != null && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              (L: {session.score_l} / R: {session.score_r})
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-sm">
        <CheckCircle2 size={14} className="text-green-500" />
        <span className="font-bold text-green-600 dark:text-green-400">
          {session.correct_count ?? 0}
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">đúng</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm">
        <XCircle size={14} className="text-red-500" />
        <span className="font-bold text-red-600 dark:text-red-400">
          {session.incorrect_count ?? 0}
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">sai</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm">
        <MinusCircle size={14} className="text-neutral-400" />
        <span className="font-bold text-neutral-500 dark:text-neutral-400">
          {session.skipped_count ?? 0}
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">bỏ qua</span>
      </div>

      {/* Accuracy bar */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="w-28 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
          {accuracy}%
        </span>
      </div>
    </div>
  );
};

export default ScoreSummary;
