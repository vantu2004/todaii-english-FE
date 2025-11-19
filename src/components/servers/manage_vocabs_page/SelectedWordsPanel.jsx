import { BookOpen, Trash2 } from "lucide-react";
import SelectedWordCard from "./SelectedWordCard";

const SelectedWordsPanel = ({
  selectedWords,
  onRemoveWord,
  onClearAll,
  onViewWord,
}) => {
  return (
    <div className="lg:col-span-1 h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 flex flex-col h-full lg:max-h-[calc(100vh-200px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            Selected Words
          </h2>
          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap">
            {selectedWords.length} words
          </span>
        </div>

        {/* Empty State or Words List */}
        {selectedWords.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-8 sm:py-10 md:py-12">
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                No words selected yet
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mt-1">
                Search and click words to add
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Words List */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 sm:space-y-2.5 md:space-y-3 mb-4 sm:mb-5 md:mb-6">
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
            <div className="pt-4 sm:pt-5 md:pt-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={onClearAll}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg md:rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Clear All</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectedWordsPanel;
