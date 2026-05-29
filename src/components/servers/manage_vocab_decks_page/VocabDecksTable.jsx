import { useEffect, useState } from "react";
import { formatISODate } from "@/utils/FormatDate";
import { deleteVocabDeck, toggleVocabDeck } from "@/api/servers/vocabDeckApi";
import toast from "react-hot-toast";
import Modal from "@/components/servers/Modal";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  BookA,
} from "lucide-react";
import { logError } from "@/utils/LogError";
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

  const handleVocabClick = (index) => {
    const vocabDeckId = decks[index].id;
    navigate(`/server/vocab-deck/${vocabDeckId}/vocab`);
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
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
              {columns.map((col) => {
                const isSortable = !!col.sortField;
                const isActiveSort = query.sortBy === col.sortField;

                return (
                  <th
                    key={col.key}
                    className={`px-4 py-3 ${
                      isSortable
                        ? "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                            <ArrowUp className="w-3 h-3 text-gray-900 dark:text-white" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-gray-900 dark:text-white" />
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
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-800">
            {decks.map((deck, i) => (
              <tr
                key={i}
                className="border-t border-gray-100 text-gray-700 dark:text-gray-400"
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
                      onClick={() => handleVocabClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                      aria-label="Vocabulary"
                    >
                      <BookA className="w-4 h-4" />
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
                  <div className="flex items-center space-x-4 text-sm">
                    <button
                      onClick={() => handleViewClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleUpdateClick(i)}
                      className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteClick(i)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
            <h2 className="text-lg font-semibold text-gray-900">Delete Deck</h2>
          }
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirmDelete();
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Deck
              </button>
            </div>
          }
        >
          <div className="space-y-4 border border-gray-200 rounded-lg p-5">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-sm text-gray-900 mb-2">
                  Are you sure you want to delete this vocab deck?
                </h3>
                <p className="text-gray-700 mb-4">
                  You are about to permanently delete the deck:
                </p>
                <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
                  <p className="text-sm font-semibold text-gray-900">
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
                <p className="text-xs text-gray-500 leading-relaxed">
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
