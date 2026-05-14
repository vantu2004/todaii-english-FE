import { Volume2, Trash2, GripVertical, Sparkles, Eye } from "lucide-react";
import { playAudioWithEvent } from "@/utils/playAudio";

const SelectedWordCard = ({ word, index, onViewWord, onRemove }) => {
  return (
    <div className="group p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
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
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
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
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={(e) => onViewWord(word)}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SelectedWordCard;
