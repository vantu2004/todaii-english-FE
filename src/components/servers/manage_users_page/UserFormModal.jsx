import { useEffect, useState } from "react";
import Modal from "../Modal";
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
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
            <Edit3 className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Update User</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Modify user profile information
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
            onClick={() => onSubmit(formData)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Email Field - Read Only */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Mail size={16} className="text-blue-600" />
            Email Address
          </label>
          <input
            type="email"
            value={initialData.email || ""}
            disabled={true}
            className="w-full px-4 py-2.5 border-2 border-gray-200 bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-2.5 flex items-center gap-1">
            <Lock size={12} />
            Email cannot be changed
          </p>
        </div>

        {/* Display Name Field */}
        <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl p-6 border border-green-200/50 hover:border-green-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <User size={16} className="text-green-600" />
            Display Name
          </label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={(e) => updateField("display_name", e.target.value)}
            placeholder="e.g., Nguyen Van B"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          />
          <p className="text-xs text-gray-600 mt-2.5">
            This name will be displayed across the platform
          </p>
        </div>

        {/* Password Field */}
        <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Lock size={16} className="text-purple-600" />
            New Password
            <span className="text-xs text-gray-500 font-normal ml-1">
              (Optional)
            </span>
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={(e) => updateField("new_password", e.target.value)}
            placeholder="Leave blank to keep current"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          />
          <p className="text-xs text-gray-600 mt-2.5">
            Only enter a new password if you want to change it
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default UserFormModal;
