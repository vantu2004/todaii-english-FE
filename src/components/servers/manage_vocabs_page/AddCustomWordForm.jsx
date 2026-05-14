import { useState } from "react";
import { Sparkles, X, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const AddCustomWordForm = ({ onAdd, onClose }) => {
  const [customWord, setCustomWord] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async () => {
    if (!customWord.trim()) return;

    try {
      setIsCreating(true);
      await onAdd(customWord);

      setCustomWord("");
      onClose();
    } catch (error) {
      console.error("Error adding custom word:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isCreating) {
      handleSubmit();
    }
  };

  return (
    <div className="pb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Add Custom Word
        </h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={customWord}
          onChange={(e) => setCustomWord(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter word not in dictionary..."
          disabled={isCreating}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 disabled:opacity-50 text-sm"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={isCreating || !customWord.trim()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isCreating ? "..." : "Add"}
        </button>
        <button
          onClick={onClose}
          disabled={isCreating}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5" />
        This word will be automatically added to the dictionary using AI
      </p>
    </div>
  );
};

export default AddCustomWordForm;
