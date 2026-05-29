import { Pencil, Trash2, Eye, Info } from "lucide-react";
import { useState } from "react";
import DOMPurify from "dompurify";
import Modal from "@/components/servers/Modal";
import ToeicQuestionDetails from "./ToeicQuestionDetails";

const ToeicQuestionsTable = ({ questions, partNumber, onEdit, onDelete }) => {
  const [detailQuestion, setDetailQuestion] = useState(null);

  const isPart12 = partNumber === 1 || partNumber === 2;
  const isPart5 = partNumber === 5;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500">
              <th className="px-6 py-4 w-16">ID</th>
              {!isPart12 && !isPart5 && (
                <th className="px-6 py-4 w-32">Passage ID</th>
              )}
              <th className="px-6 py-4 min-w-[200px]">
                {isPart12 ? "Transcript (Preview)" : "Question"}
              </th>
              {!isPart12 && (
                <>
                  <th className="px-6 py-4">Option A</th>
                  <th className="px-6 py-4">Option B</th>
                  <th className="px-6 py-4">Option C</th>
                  <th className="px-6 py-4">Option D</th>
                </>
              )}
              <th className="px-6 py-4 w-28">Correct</th>
              <th className="px-6 py-4 min-w-[200px]">Explanation</th>
              <th className="px-6 py-4 w-32">Tags</th>
              <th className="px-6 py-4 w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {questions.map((question) => (
              <tr
                key={question.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {question.id}
                </td>

                {!isPart12 && !isPart5 && (
                  <td className="px-6 py-4 text-sm font-medium text-gray-950 dark:text-gray-200">
                    #{question.passage_id || question.passageId || "N/A"}
                  </td>
                )}

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="truncate max-w-xs line-clamp-2 prose dark:prose-invert prose-sm text-ellipsis overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        isPart12
                          ? question.transcript || "No transcript"
                          : question.question || "No question",
                      ),
                    }}
                  />
                </td>

                {!isPart12 && (
                  <>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                      title={question.option_a || question.optionA}
                    >
                      {question.option_a || question.optionA}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                      title={question.option_b || question.optionB}
                    >
                      {question.option_b || question.optionB}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                      title={question.option_c || question.optionC}
                    >
                      {question.option_c || question.optionC}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[150px] truncate"
                      title={question.option_d || question.optionD}
                    >
                      {question.option_d || question.optionD}
                    </td>
                  </>
                )}

                <td className="px-6 py-4 text-sm">
                  <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
                    {question.correct_ans || question.correctAns || "N/A"}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="truncate max-w-xs line-clamp-2 prose dark:prose-invert prose-sm text-ellipsis overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        question.explanation || "No explanation",
                      ),
                    }}
                  />
                </td>

                <td className="px-6 py-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {question.tags?.length > 0 ? (
                      question.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-0.5 rounded text-xs whitespace-nowrap"
                        >
                          {tag.name || tag.alias}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        No tags
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDetailQuestion(question)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="View Detail"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(question)}
                      className="text-gray-400 hover:text-gray-700 transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(question.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {questions.length === 0 && (
              <tr>
                <td
                  colSpan={isPart12 ? 6 : isPart5 ? 9 : 10}
                  className="px-6 py-8 text-center text-gray-500 text-sm italic"
                >
                  No questions found for this part.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detailQuestion && (
        <Modal
          isOpen={true}
          onClose={() => setDetailQuestion(null)}
          width="sm:max-w-4xl"
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <Info className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Question Details
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Detailed preview of the question content
                </p>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDetailQuestion(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          }
        >
          <ToeicQuestionDetails
            question={detailQuestion}
            partNumber={partNumber}
          />
        </Modal>
      )}
    </div>
  );
};

export default ToeicQuestionsTable;
