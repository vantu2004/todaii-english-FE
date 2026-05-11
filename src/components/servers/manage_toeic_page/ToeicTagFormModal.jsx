import { useState, useEffect } from "react";
import Modal from "@/components/servers/Modal";
import { Tag } from "lucide-react";

const ToeicTagFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
    } else {
      setName("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
            <Tag className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {initialData ? "Edit Tag" : "Create Tag"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your TOEIC tags
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
            className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            {initialData ? "Update Tag" : "Create Tag"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="bg-gradient-to-br from-slate-50 to-pink-50 rounded-2xl p-6 border border-pink-200/50 hover:border-pink-300 hover:shadow-md transition-all space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              <Tag size={16} className="text-pink-600" />
              Tag Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grammar"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ToeicTagFormModal;
