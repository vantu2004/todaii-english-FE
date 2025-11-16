import { useState } from "react";
import Modal from "../Modal";
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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
            <FolderPlus className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Create Vocab Group
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Add a new vocabulary group to organize your words
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            Create Group
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Group Name */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            <Tag size={16} className="text-blue-600" />
            Group Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Travel Vocabulary, Business Terms, Phrasal Verbs"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          <p className="text-xs text-gray-600 mt-2.5">
            Choose a clear, descriptive name for the vocabulary group.
          </p>
        </div>

        {/* Info Notice */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 rounded-lg hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0 mt-0.5">
              <Lightbulb size={16} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-1 uppercase tracking-wide">
                Vocabulary Organization
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed">
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
