import Modal from "@/components/servers/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

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
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-100 to-red-50 rounded-lg">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Delete {itemName}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              This action cannot be undone
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
            onClick={onConfirm}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete {itemName}
          </button>
        </div>
      }
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border-2 border-red-200/50">
        <h3 className="font-bold text-gray-900 mb-2 text-lg">
          Are you sure you want to delete this {itemName.toLowerCase()}?
        </h3>
        {warningText && (
          <p className="text-sm text-red-600 mb-4">{warningText}</p>
        )}
        {targetName && (
          <div className="bg-white rounded-lg p-3 border border-red-300 mb-4">
            <p className="text-sm font-semibold text-red-700">{targetName}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
