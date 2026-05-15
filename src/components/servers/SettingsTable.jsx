import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { formatISODate } from "@/utils/FormatDate";

const SettingsTable = ({ settings, onUpdate }) => {
  const columns = [
    { key: "key", label: "Key" },
    { key: "setting_category", label: "Category" },
    { key: "updated_at", label: "Updated At" },
  ];

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedValue, setEditedValue] = useState("");
  const [visibleIndex, setVisibleIndex] = useState(null);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedValue(settings[index].value);
    setVisibleIndex(index); // show value khi edit
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedValue("");
    setVisibleIndex(null); // ẩn value
  };

  const handleUpdate = async (index) => {
    await onUpdate(settings[index].key, editedValue);
    setEditingIndex(null);
    setEditedValue("");
    setVisibleIndex(null); // ẩn value sau khi update
  };

  const handleShowValue = (index) => {
    setVisibleIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="h-full rounded-lg overflow-y-auto">
      <table className="w-full whitespace-nowrap">
        {/* Header */}
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3">Value</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y">
          {settings.map((item, i) => {
            const isEditing = editingIndex === i;
            const isVisible = visibleIndex === i;

            return (
              <tr key={i} className="border-t border-gray-100 text-gray-700">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm">
                    {col.key === "updated_at"
                      ? formatISODate(item[col.key])
                      : item[col.key]}
                  </td>
                ))}

                {/* Value column */}
                <td
                  className="px-4 py-3 text-sm cursor-pointer"
                  onClick={() => !isEditing && handleShowValue(i)}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                    />
                  ) : isVisible ? (
                    <span className="font-medium">{item.value}</span>
                  ) : (
                    <span className="text-gray-400 italic">••••••</span>
                  )}
                </td>

                {/* Action column */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdate(i)}
                          className="p-2 text-gray-400 hover:text-gray-700 rounded-lg"
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          onClick={handleCancelEdit}
                          className="p-2 text-gray-400 hover:text-gray-700 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditClick(i)}
                        className="p-2 text-gray-400 hover:text-gray-700 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SettingsTable;
