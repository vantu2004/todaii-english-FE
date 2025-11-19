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
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No words found</p>
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
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600 shadow-sm"
                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    ID: {word.id}
                  </p>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {word.headword}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {word.ipa}
                    </span>
                  </div>
                </div>

                {word.audio_url && (
                  <button
                    onClick={(e) => playAudioWithEvent(e, word.audio_url)}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-lg transition-colors mt-1"
                  >
                    <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                )}

                <button
                  onClick={(e) => onViewWord(word)}
                  className="p-2 hover:bg-green-100 dark:hover:bg-gray-800 rounded-lg transition-colors mt-1"
                >
                  <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DictionaryWordsList;
