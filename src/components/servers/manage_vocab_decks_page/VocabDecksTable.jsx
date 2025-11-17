import { useEffect, useState } from "react";
import { formatISODate } from "./../../../utils/FormatDate";
import {
  deleteVocabDeck,
  toggleVocabDeck,
} from "../../../api/servers/vocabDeckApi";
import toast from "react-hot-toast";
import Modal from "../Modal";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Library,
} from "lucide-react";
import { logError } from "../../../utils/LogError";
import { useNavigate } from "react-router-dom";
import VocabDeckViewModal from "./VocabDeckViewModal";

const VocabDecksTable = ({
  columns,
  decks,
  reloadDecks,
  query,
  updateQuery,
}) => {
  const [enabledStates, setEnabledStates] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(null);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setEnabledStates(decks.map((deck) => deck.enabled));
  }, [decks]);

  const handleToggle = async (index) => {
    setEnabledStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });

    try {
      const deckId = decks[index].id;

      await toggleVocabDeck(deckId);
      await reloadDecks();
    } catch (err) {
      logError(err);
    }
  };

  const handleViewClick = (index) => {
    setSelectedDeck(decks[index]);
    setIsViewModalOpen(true);
  };

  const handleUpdateClick = (index) => {
    const vocabDeckId = decks[index].id;
    navigate(`/server/vocab-deck/${vocabDeckId}/update`);
  };

  const handleDeleteClick = (index) => {
    setSelectedDeckIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDeckIndex === null) return;

    try {
      const deckId = decks[selectedDeckIndex].id;
      await deleteVocabDeck(deckId);
      await reloadDecks();

      setSelectedDeckIndex(null);
      setIsDeleteModalOpen(false);

      toast.success("Vocab deck deleted");
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <div className="h-full rounded-lg overflow-y-auto">
        <table className="w-full table-auto">
          {/* === Table Header === */}
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
                        ? "cursor-pointer select-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                            <ArrowUp className="w-3 h-3 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-blue-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* === Table Body === */}
          <tbody className="bg-white divide-y divide-gray-300 dark:divide-gray-700 dark:bg-gray-800">
            {decks.map((deck, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 text-gray-700 dark:text-gray-400"
              >
                <td className="px-4 py-3 text-sm">{deck.id}</td>
                <td className="px-4 py-3 text-sm font-semibold">{deck.name}</td>
                <td className="px-4 py-3 text-sm">{deck.description}</td>
                <td className="px-4 py-3 text-sm">{deck.cefr_level}</td>
                <td className="px-4 py-3 text-sm">
                  {formatISODate(deck.updated_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm">
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      aria-label="Vocabulary"
                    >
                      <Library className="w-5 h-5" />
                    </button>
                  </div>
                </td>
                {/* Enable toggle */}
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

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <button
                      onClick={() => handleViewClick(i)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleUpdateClick(i)}
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
          </tbody>
        </table>
      </div>

      {/* Modal view deck */}
      {selectedDeck && (
        <VocabDeckViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          deck={selectedDeck}
        />
      )}

      {/* Modal delete deck */}
      {selectedDeckIndex !== null && selectedDeckIndex !== undefined && (
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
                  Delete Deck
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
                onClick={() => {
                  handleConfirmDelete();
                  setIsDeleteModalOpen(false);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Deck
              </button>
            </div>
          }
        >
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border-2 border-red-200/50">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  Are you sure you want to delete this vocab deck?
                </h3>
                <p className="text-gray-700 mb-4">
                  You are about to permanently delete the deck:
                </p>
                <div className="bg-white rounded-lg p-3 border border-red-300 mb-4">
                  <p className="text-sm font-semibold text-red-700">
                    {selectedDeckIndex !== null
                      ? decks[selectedDeckIndex].name
                      : ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedDeckIndex !== null
                      ? decks[selectedDeckIndex].description
                      : ""}
                  </p>
                </div>
                <p className="text-xs text-red-600 leading-relaxed">
                  ⚠️ This action is permanent and cannot be reversed.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default VocabDecksTable;
