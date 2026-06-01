import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/servers/Modal";
import { Check, Square, CheckSquare } from "lucide-react";
import { parseDictionaryWord } from "@/utils/wordParser";

const VocabExtractionModal = ({
  isOpen,
  onClose,
  extractedWords,
  currentWords,
  onAddSelected,
  isAdding,
}) => {
  const [selectedWordIds, setSelectedWordIds] = useState([]);

  const parsedExtracted = useMemo(
    () => (extractedWords || []).map((w) => parseDictionaryWord(w)),
    [extractedWords],
  );

  const parsedCurrent = useMemo(
    () => (currentWords || []).map((w) => parseDictionaryWord(w)),
    [currentWords],
  );

  const currentWordIds = useMemo(
    () => parsedCurrent.map((w) => w.id),
    [parsedCurrent],
  );

  useEffect(() => {
    if (isOpen) {
      // By default, select all words that are not already in currentWords
      const initialSelectedIds = parsedExtracted
        .filter((w) => !currentWordIds.includes(w.id))
        .map((w) => w.id);
      setSelectedWordIds(initialSelectedIds);
    }
  }, [isOpen, parsedExtracted, currentWordIds]);

  const toggleWordSelection = (wordId) => {
    if (currentWordIds.includes(wordId)) return; // Already added, can't toggle

    setSelectedWordIds((prev) => {
      if (prev.includes(wordId)) {
        return prev.filter((id) => id !== wordId);
      } else {
        return [...prev, wordId];
      }
    });
  };

  const selectableWords = useMemo(
    () => parsedExtracted.filter((w) => !currentWordIds.includes(w.id)),
    [parsedExtracted, currentWordIds],
  );

  const toggleAll = () => {
    if (selectedWordIds.length === selectableWords.length) {
      setSelectedWordIds([]);
    } else {
      setSelectedWordIds(selectableWords.map((w) => w.id));
    }
  };

  const handleAdd = () => {
    onAddSelected(selectedWordIds);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="sm:max-w-2xl"
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            AI Suggested Vocabulary
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium px-2 py-0.5 rounded-md">
            {extractedWords.length} words found
          </span>
        </div>
      }
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors text-sm"
            disabled={isAdding}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedWordIds.length === 0 || isAdding}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm shadow-sm"
          >
            {isAdding ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </>
            ) : (
              `Add Selected (${selectedWordIds.length})`
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-505 dark:text-gray-400">
            Select the words you want to add to this content.
          </p>
          {selectableWords.length > 0 && (
            <button
              onClick={toggleAll}
              className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 transition-colors bg-white dark:bg-gray-800 border border-gray-250 dark:border-gray-700 rounded px-2.5 py-1 shadow-sm"
              type="button"
            >
              {selectedWordIds.length === selectableWords.length ? (
                <>
                  <CheckSquare
                    size={14}
                    className="text-gray-900 dark:text-white"
                  />{" "}
                  Deselect All
                </>
              ) : (
                <>
                  <Square size={14} className="text-gray-400" /> Select All
                </>
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
          {parsedExtracted.map((word) => {
            const isAlreadyAdded = currentWordIds.includes(word.id);
            const isSelected = selectedWordIds.includes(word.id);

            return (
              <div
                key={word.id}
                onClick={() => toggleWordSelection(word.id)}
                className={`flex items-center justify-between p-2.5 border rounded-lg transition-all duration-150 m-1 ${
                  isAlreadyAdded
                    ? "bg-gray-50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-60"
                    : isSelected
                      ? "bg-white dark:bg-gray-850 border-gray-900 dark:border-gray-100 ring-1 ring-gray-900 dark:ring-gray-100 cursor-pointer shadow-sm"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex-shrink-0">
                    {isAlreadyAdded ? (
                      <Check
                        size={16}
                        className="text-gray-400 dark:text-gray-600"
                      />
                    ) : isSelected ? (
                      <CheckSquare
                        size={16}
                        className="text-gray-900 dark:text-white"
                      />
                    ) : (
                      <Square
                        size={16}
                        className="text-gray-400 dark:text-gray-600"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <span
                      className={`font-semibold text-sm truncate ${
                        isAlreadyAdded
                          ? "text-gray-400 dark:text-gray-600 line-through"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {word.word}
                    </span>
                    {word.ipa && (
                      <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        /{word.ipa}/
                      </span>
                    )}
                  </div>
                </div>
                {isAlreadyAdded && (
                  <span className="text-[10px] font-medium text-gray-450 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/50 px-1.5 py-0.5 rounded flex-shrink-0">
                    Added
                  </span>
                )}
              </div>
            );
          })}

          {extractedWords.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-450 text-sm">
              No vocabulary words found by AI.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VocabExtractionModal;
