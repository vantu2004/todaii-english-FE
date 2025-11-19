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
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
          className="flex-1 px-4 py-2.5 border-2 border-blue-300 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={isCreating || !customWord.trim()}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creating..." : "Add"}
        </button>
        <button
          onClick={onClose}
          disabled={isCreating}
          className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
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
