import { useEffect, useState } from "react";
import Modal from "@/components/servers/Modal";
import { Lock } from "lucide-react";

const UserFormModal = ({ isOpen, onClose, initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({ new_password: "", display_name: "" });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({ new_password: "", display_name: initialData.display_name || "" });
    } else {
      setFormData({ new_password: "", display_name: "" });
    }
  }, [initialData]);

  const updateField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update User"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={() => onSubmit(formData)} className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">Save Changes</button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Email — Read Only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
          <input
            type="email"
            value={initialData.email || ""}
            disabled={true}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-lg text-sm cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1"><Lock size={12} /> Email cannot be changed</p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Name</label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={(e) => updateField("display_name", e.target.value)}
            placeholder="e.g., Nguyen Van B"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">This name will be displayed across the platform</p>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            New Password <span className="text-xs text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={(e) => updateField("new_password", e.target.value)}
            placeholder="Leave blank to keep current"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Only enter a new password if you want to change it</p>
        </div>
      </div>
    </Modal>
  );
};

export default UserFormModal;
