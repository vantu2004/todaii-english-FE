import { useEffect, useState } from "react";
import Modal from "@/components/servers/Modal";
import { Mail, Lock, User, Edit3 } from "lucide-react";

const UserFormModal = ({ isOpen, onClose, initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    new_password: "",
    display_name: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        new_password: "",
        display_name: initialData.display_name || "",
      });
    } else {
      setFormData({
        new_password: "",
        display_name: "",
      });
    }
  }, [initialData]);

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <Edit3 className="text-neutral-700 dark:text-neutral-300" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Update User</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Modify user profile information
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-medium transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Email Field - Read Only */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
            <Mail size={16} className="text-neutral-500 dark:text-neutral-400" />
            Email Address
          </label>
          <input
            type="email"
            value={initialData.email || ""}
            disabled={true}
            className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 rounded-lg cursor-not-allowed"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 flex items-center gap-1">
            <Lock size={12} />
            Email cannot be changed
          </p>
        </div>

        {/* Display Name Field */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
            <User size={16} className="text-neutral-500 dark:text-neutral-400" />
            Display Name
          </label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={(e) => updateField("display_name", e.target.value)}
            placeholder="e.g., Nguyen Van B"
            className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5">
            This name will be displayed across the platform
          </p>
        </div>

        {/* Password Field */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
            <Lock size={16} className="text-neutral-500 dark:text-neutral-400" />
            New Password
            <span className="text-xs text-neutral-500 dark:text-neutral-500 font-normal ml-1">
              (Optional)
            </span>
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={(e) => updateField("new_password", e.target.value)}
            placeholder="Leave blank to keep current"
            className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5">
            Only enter a new password if you want to change it
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default UserFormModal;
