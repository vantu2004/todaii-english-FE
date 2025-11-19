import { BookOpen, Trash2 } from "lucide-react";
import SelectedWordCard from "./SelectedWordCard";

const SelectedWordsPanel = ({
  selectedWords,
  onRemoveWord,
  onClearAll,
  onViewWord,
}) => {
  return (
    <div className="lg:col-span-1 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full ">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Selected Words
          </h2>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-semibold text-sm">
            {selectedWords.length} words
          </span>
        </div>

        {/* Empty State or Words List */}
        {selectedWords.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No words selected yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Search and click words to add
            </p>
          </div>
        ) : (
          <>
            {/* Words List */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-6">
              {selectedWords.map((word, index) => (
                <SelectedWordCard
                  key={word.id}
                  word={word}
                  index={index}
                  onViewWord={onViewWord}
                  onRemove={onRemoveWord}
                />
              ))}
            </div>

            {/* Clear All Button */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClearAll}
                className="w-full px-4 py-2.5 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectedWordsPanel;
