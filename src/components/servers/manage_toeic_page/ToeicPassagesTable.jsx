import { Pencil, Trash2, Eye, List, Info } from "lucide-react";
import { useState } from "react";
import DOMPurify from "dompurify";
import Modal from "@/components/servers/Modal";
import ToeicPassageDetails from "./ToeicPassageDetails";

const ToeicPassagesTable = ({
  passages,
  onEdit,
  onDelete,
  onManageQuestions,
}) => {
  const [detailPassage, setDetailPassage] = useState(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-left text-xs font-semibold text-gray-500">
              <th className="px-6 py-4 w-16">ID</th>
              <th className="px-6 py-4 min-w-[250px]">
                Passage Text (Preview)
              </th>
              <th className="px-6 py-4 min-w-[250px]">Passage Translation</th>
              <th className="px-6 py-4 w-32">Questions</th>
              <th className="px-6 py-4 w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {passages.map((passage) => (
              <tr
                key={passage.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                  {passage.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="truncate max-w-xs line-clamp-2 prose dark:prose-invert prose-sm text-ellipsis overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        passage.passageText ||
                          passage.passage_text ||
                          "No text",
                      ),
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div
                    className="truncate max-w-xs line-clamp-2 prose dark:prose-invert prose-sm text-ellipsis overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        passage.passageTrans ||
                          passage.passage_trans ||
                          "No translation",
                      ),
                    }}
                  />
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <button
                    onClick={() =>
                      onManageQuestions && onManageQuestions(passage)
                    }
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition font-bold"
                    title="Manage Questions"
                  >
                    <List size={18} />
                    Questions ({passage.questions?.length || 0})
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDetailPassage(passage)}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="View Detail"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(passage)}
                      className="text-gray-400 hover:text-gray-700 transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(passage.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {passages.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-gray-500 text-sm italic"
                >
                  No passages found for this part.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {detailPassage && (
        <Modal
          isOpen={true}
          onClose={() => setDetailPassage(null)}
          width="sm:max-w-4xl"
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                <Info className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Passage Details
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Detailed preview of the passage content
                </p>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDetailPassage(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          }
        >
          <ToeicPassageDetails passage={detailPassage} />
        </Modal>
      )}
    </div>
  );
};

export default ToeicPassagesTable;
