import React from "react";
import Modal from "../Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

const DeleteAllLyricsModal = ({ isOpen, onClose, onConfirm }) => {
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
              Delete All Lyrics
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
            Delete All Lyrics
          </button>
        </div>
      }
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border-2 border-red-200/50">
        <h3 className="font-bold text-gray-900 mb-2 text-lg">
          Are you sure you want to delete all lyric lines?
        </h3>
        <p className="text-gray-700 mb-4">
          You are about to permanently delete <strong>all lyrics</strong> in
          this video.
        </p>
        <p className="text-xs text-red-600 leading-relaxed">
          ⚠️ This action is permanent and cannot be reversed.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteAllLyricsModal;
