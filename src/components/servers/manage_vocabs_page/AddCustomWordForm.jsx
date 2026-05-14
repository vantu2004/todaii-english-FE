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
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Add Custom Word
        </h3>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={customWord}
          onChange={(e) => setCustomWord(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter word not in dictionary..."
          disabled={isCreating}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 disabled:opacity-50 text-sm"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={isCreating || !customWord.trim()}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isCreating ? "Creating..." : "Add"}
        </button>
        <button
          onClick={onClose}
          disabled={isCreating}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50 text-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        This word will be automatically added to the dictionary using AI
      </p>
    </div>
  );
};

export default AddCustomWordForm;
