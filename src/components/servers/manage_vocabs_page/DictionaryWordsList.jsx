import { Search, Volume2, CheckCircle, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { playAudioWithEvent } from "../../../utils/playAudio";

const DictionaryWordsList = ({
  words,
  isWordSelected,
  onSelectWord,
  onViewWord,
}) => {
  if (words.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center py-8 sm:py-10 md:py-12">
          <Search className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            No words found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
      {words.map((word) => {
        const isSelected = isWordSelected(word.id);
        return (
          <div
            key={word.id}
            onClick={() => onSelectWord(word.id)}
            className={`p-3 sm:p-3.5 md:p-4 rounded-lg md:rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600 shadow-sm"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-1">
                    ID: {word.id}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3 mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 break-words">
                      {word.headword}
                    </h3>
                    {word.ipa && (
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {word.ipa}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                  {word.audio_url && (
                    <button
                      onClick={(e) => playAudioWithEvent(e, word.audio_url)}
                      className="p-1.5 sm:p-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewWord(word);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-green-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DictionaryWordsList;
