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
    <div className="h-full overflow-y-auto">
      <table className="w-full whitespace-nowrap">
        <thead className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
          <tr className="text-xs font-medium text-left text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-3 w-20">ID</th>
            <th className="px-4 py-3 w-64">Word</th>
            <th className="px-4 py-3">JSON Data</th>
            <th className="px-4 py-3 w-32 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {dictionary.map((entry, index) => {
            const isLast = index === dictionary.length - 1;
            const isEditing = editingId === entry.id;

            // XỬ LÝ SNAKE CASE ĐÂY
            const jsonString = entry.json_data || entry.jsonData;

            return (
              <tr
                key={entry.id}
                ref={isLast ? lastElementRef : null}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-500">#{entry.id}</td>

                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {isEditing ? (
                    <input
                      autoFocus
                      type="text"
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900/20 outline-none"
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

                <td className="px-4 py-3 text-sm text-gray-500">
                  <div className="max-w-md truncate opacity-70">
                    {jsonString ? (
                      jsonString
                    ) : (
                      <span className="italic text-gray-400">Null</span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(entry.id)}
                          disabled={isSaving}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
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
                          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onViewClick(entry)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteClick(entry)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
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
