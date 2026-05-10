import { useEffect, useState } from "react";
import { formatISODate } from "../../../utils/FormatDate";
import toast from "react-hot-toast";
import Modal from "../Modal";
import {
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";
import {
  deleteToeicCollection,
  toggleToeicCollectionEnabled,
} from "../../../api/servers/toeicCollectionApi";
import { logError } from "../../../utils/LogError";

const truncateWords = (str, maxWords = 150) => {
  if (!str) return "";
  const words = str.split(/\s+/);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }
  return str;
};

const ToeicCollectionsTable = ({
  columns,
  collections,
  reloadCollections,
  query,
  updateQuery,
  onEdit,
}) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setEnabledStates(collections.map((c) => c.enabled));
  }, [collections]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const id = collections[index].id;
      await toggleToeicCollectionEnabled(id);
      await reloadCollections();
    } catch (err) {
      logError(err);
      // Revert state if error
      setEnabledStates((prev) => {
        const newStates = [...prev];
        newStates[index] = !newStates[index];
        return newStates;
      });
    }
  };

  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex === null) return;
    try {
      const id = collections[selectedIndex].id;
      await deleteToeicCollection(id);
      await reloadCollections();
      setSelectedIndex(null);
      setIsDeleteModalOpen(false);
      toast.success("Collection deleted successfully");
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        : ""
                    }`}
                    onClick={() => {
                      if (!isSortable) return;
                      const newDirection = isActiveSort
                        ? query.direction === "asc"
                          ? "desc"
                          : "asc"
                        : "asc";

                      updateQuery({
                        sortBy: col.sortField,
                        direction: newDirection,
                        page: query.page,
                      });
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {isSortable && isActiveSort && (
                        <span className="inline-flex items-center">
                          {query.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3 text-indigo-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-indigo-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
            {collections.map((item, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-semibold">{item.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                <td className="px-4 py-3 text-sm">{item.alias}</td>
                
                <td 
                  className="px-4 py-3 text-sm max-w-xs truncate cursor-help" 
                  title={item.description || ""}
                >
                  {truncateWords(item.description, 150)}
                </td>

                <td className="px-4 py-3 text-sm">
                  {formatISODate(item.updatedAt || item.updated_at)}
                </td>

                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleToggle(i)}
                    className={`relative cursor-pointer w-10 h-5 rounded-full border transition-colors duration-300 ease-in-out ${
                      enabledStates[i]
                        ? "bg-green-400 border-green-400"
                        : "bg-neutral-300 border-neutral-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1/2 left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transform -translate-y-1/2 transition-transform duration-300 ease-in-out ${
                        enabledStates[i] ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(i)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  No collections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedIndex !== null && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Delete Collection
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Collection
              </button>
            </div>
          }
        >
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border-2 border-red-200/50">
            <h3 className="font-bold text-gray-900 mb-2 text-lg">
              Are you sure you want to delete this collection?
            </h3>
            <div className="bg-white rounded-lg p-3 border border-red-300 mb-4">
              <p className="text-sm font-semibold text-red-700">
                {collections[selectedIndex]?.name}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ToeicCollectionsTable;
