import Modal from "@/components/servers/Modal";
import { Trash2 } from "lucide-react";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName = "Item",
  targetName,
  warningText,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-lg font-semibold text-gray-900">
          Delete {itemName}
        </h2>
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
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete {itemName}
          </button>
        </div>
      }
    >
      <div className="space-y-3 border border-gray-200 rounded-lg p-5">
        <h3 className="text-sm text-gray-900">
          Are you sure you want to delete this {itemName.toLowerCase()}?
        </h3>
        {warningText && (
          <p className="text-sm text-gray-500">{warningText}</p>
        )}
        {targetName && (
          <div className="bg-gray-50 rounded-md p-3 border border-gray-200 text-sm font-semibold text-gray-900">
            {targetName}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
