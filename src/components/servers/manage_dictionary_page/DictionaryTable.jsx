import { Eye, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";

const DictionaryTable = ({
  dictionary,
  lastElementRef,
  onViewClick,
  onDeleteClick,
  onInlineUpdate,
  loading,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editWordValue, setEditWordValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditWordValue(entry.word);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditWordValue("");
  };

  const handleSave = async (id) => {
    if (!editWordValue.trim()) return;
    setIsSaving(true);
    try {
      await onInlineUpdate(id, editWordValue);
      setEditingId(null);
    } catch (e) {
      // lỗi thì giữ form
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full rounded-lg overflow-y-auto">
      <table className="w-full whitespace-nowrap">
        <thead className="sticky top-0 z-10">
          <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <th className="px-4 py-3 ">ID</th>
            <th className="px-4 py-3 ">Word</th>
            <th className="px-4 py-3">JSON Data</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 dark:divide-gray-800/50 dark:bg-gray-900">
          {dictionary.map((entry, index) => {
            const isLast = index === dictionary.length - 1;
            const isEditing = editingId === entry.id;

            // XỬ LÝ SNAKE CASE ĐÂY
            const jsonString = entry.json_data || entry.jsonData;

            return (
              <tr
                key={entry.id}
                ref={isLast ? lastElementRef : null}
                className="text-gray-900 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm">{entry.id}</td>

                <td className="px-4 py-3 text-sm font-semibold">
                  {isEditing ? (
                    <input
                      autoFocus
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-100/10 focus:border-gray-400 outline-none text-gray-900 dark:text-gray-100 transition-colors"
                      value={editWordValue}
                      onChange={(e) => setEditWordValue(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSave(entry.id)
                      }
                      disabled={isSaving}
                    />
                  ) : (
                    entry.word
                  )}
                </td>

                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="max-w-md truncate opacity-70">
                    {jsonString ? (
                      jsonString
                    ) : (
                      <span className="italic">Null</span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className=" space-x-4 text-sm">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(entry.id)}
                          disabled={isSaving}
                          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={isSaving}
                          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onViewClick(entry)}
                          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                          aria-label="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                          aria-label="Update"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(entry)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {loading && (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DictionaryTable;