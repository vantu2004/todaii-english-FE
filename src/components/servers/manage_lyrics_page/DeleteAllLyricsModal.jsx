import React from "react";
import Modal from "@/components/servers/Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

const DeleteAllLyricsModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-lg font-semibold text-gray-900">
          Delete All Lyrics
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
            Delete All Lyrics
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <h3 className="text-sm text-gray-900">
          Are you sure you want to delete all lyric lines?
        </h3>
        <p className="text-sm text-gray-700">
          You are about to permanently delete <strong>all lyrics</strong> in
          this video.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          ⚠️ This action is permanent and cannot be reversed.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteAllLyricsModal;
