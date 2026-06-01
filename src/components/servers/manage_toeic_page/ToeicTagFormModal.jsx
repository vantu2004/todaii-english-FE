import { useState, useEffect } from "react";
import Modal from "@/components/servers/Modal";
import { Tag } from "lucide-react";
import toast from "react-hot-toast";

const ToeicTagFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPartNumber(initialData.partNumber || initialData.part_number || "");
    } else {
      setName("");
      setPartNumber("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Tag name is required");
      return;
    }
    let pNum = null;
    if (partNumber !== "") {
      pNum = parseInt(partNumber, 10);
      if (isNaN(pNum) || pNum < 1 || pNum > 7) {
        toast.error("Part number must be between 1 and 7");
        return;
      }
    }
    onSubmit(name, pNum);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {initialData ? "Edit Tag" : "Create Tag"}
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
            {initialData ? "Update Tag" : "Create Tag"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Tag Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grammar"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              <Tag size={16} className="text-pink-600" />
              Part Number
            </label>
            <input
              type="number"
              name="partNumber"
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              placeholder="e.g., 1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ToeicTagFormModal;
