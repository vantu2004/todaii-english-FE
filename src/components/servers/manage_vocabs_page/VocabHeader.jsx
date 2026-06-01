import { ArrowLeft, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";

const VocabHeader = ({ contentInfo, onVocabExtract, isExtracting }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
      {/* Left Section */}
      <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to previous page</span>
          </button>

          {contentInfo && (
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md font-medium whitespace-nowrap">
                {contentInfo.type}
              </span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0 hidden xs:block" />
              <span className="font-medium text-gray-900 dark:text-gray-100 break-words line-clamp-2">
                {contentInfo.title}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Vocab Extraction Button */}
      {onVocabExtract && (
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onVocabExtract}
            disabled={isExtracting}
            className={`w-full sm:w-auto px-3.5 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all text-xs sm:text-sm ${
              isExtracting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isExtracting ? "Extracting..." : "Vocab Extraction"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VocabHeader;
