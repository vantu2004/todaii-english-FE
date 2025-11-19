import { Volume2, Trash2, GripVertical, Sparkles, Eye } from "lucide-react";
import { playAudioWithEvent } from "../../../utils/playAudio";

const SelectedWordCard = ({ word, index, onViewWord, onRemove }) => {
  return (
    <div className="group p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
            #{index + 1} (ID: {word.id})
          </span>
        </div>
        <button
          onClick={() => onRemove(word.id)}
          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate">
            {word.headword}
          </h3>
          {word.ipa && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
              {word.ipa}
            </p>
          )}
        </div>
        {word.audio_url && (
          <button
            onClick={(e) => playAudioWithEvent(e, word.audio_url)}
            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={(e) => onViewWord(word)}
          className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SelectedWordCard;
