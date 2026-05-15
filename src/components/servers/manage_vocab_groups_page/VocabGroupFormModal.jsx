import { useState } from "react";
import Modal from "@/components/servers/Modal";
import { FolderPlus, Tag, Lightbulb } from "lucide-react";

const VocabGroupFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    onSubmit(name);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-lg font-semibold text-gray-900">
          Create Vocab Group
        </h2>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            Create Group
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Travel Vocabulary, Business Terms, Phrasal Verbs"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
          />
          <p className="text-xs text-gray-500 mt-2">
            Choose a clear, descriptive name for the vocabulary group.
          </p>
        </div>

        {/* Info Notice */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb size={20} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Vocabulary Organization
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Vocabulary groups help organize your words by topic or theme.
                Use meaningful names so it's easy to review and study later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VocabGroupFormModal;
