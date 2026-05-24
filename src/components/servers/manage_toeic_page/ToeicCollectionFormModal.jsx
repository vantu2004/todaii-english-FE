import { useState, useEffect } from "react";
import Modal from "@/components/servers/Modal";
import { FolderPlus, Tag, FileText, Link2 } from "lucide-react";

const ToeicCollectionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {initialData ? "Edit Collection" : "Create Collection"}
            </h2>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium transition-all"
          >
            {initialData ? "Update Collection" : "Create Collection"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Collection Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., ETS 2024"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe this collection..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ToeicCollectionFormModal;
