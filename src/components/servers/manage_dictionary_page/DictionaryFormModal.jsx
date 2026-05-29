import { useState } from "react";
import Modal from "@/components/servers/Modal";

const DictionaryFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [word, setWord] = useState("");

  const handleSubmit = () => {
    if (word.trim()) {
      onSubmit(word.trim());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-lg font-semibold text-gray-900">Create New Word</h2>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!word.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          >
            Create
          </button>
        </div>
      }
      width="max-w-md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vocabulary Word <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            autoFocus
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. hello, robust..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-900 outline-none"
          />
        </div>
        <p className="text-xs text-gray-500">
          Note: The system will automatically fetch detailed JSON data from the
          Todaii API if a user performs a lookup.{" "}
        </p>
      </div>
    </Modal>
  );
};

export default DictionaryFormModal;
