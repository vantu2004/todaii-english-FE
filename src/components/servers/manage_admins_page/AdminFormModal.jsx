import { useEffect, useState } from "react";
import Modal from "@/components/servers/Modal";
import { Lock, Check } from "lucide-react";

const AdminFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = {},
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    roleCodes: [],
  });

  const roles = [
    { code: "SUPER_ADMIN", desc: "Super Admin" },
    { code: "USER_MANAGER", desc: "User Manager" },
    { code: "CONTENT_MANAGER", desc: "Content Manager" },
  ];

  const isCreate = mode === "create";

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        email: initialData.email || "",
        password: "",
        displayName: initialData.display_name || "",
        roleCodes: (initialData.roles || []).map((r) => r.code),
      });
    } else {
      setFormData({ email: "", password: "", displayName: "", roleCodes: [] });
    }
  }, [initialData]);

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));
  const toggleRole = (roleCode) => {
    setFormData((prev) => ({
      ...prev,
      roleCodes: prev.roleCodes.includes(roleCode)
        ? prev.roleCodes.filter((r) => r !== roleCode)
        : [...prev.roleCodes, roleCode],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreate ? "Create Admin Account" : "Update Admin Account"}
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            {isCreate ? "Create Admin" : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address {isCreate && <span className="text-red-500">*</span>}
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="admin@example.com"
            disabled={!isCreate}
            className={`w-full px-3 py-2 border rounded-lg text-sm outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 ${
              isCreate
                ? "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          />
          {!isCreate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
              <Lock size={12} /> Email cannot be changed
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Password {isCreate && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder={
              isCreate ? "Enter secure password" : "Leave blank to keep current"
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          />
          {!isCreate && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Only enter a new password if you want to change it
            </p>
          )}
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => updateField("displayName", e.target.value)}
            placeholder="e.g., Nguyen Van A"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
          />
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Admin Roles
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Select one or more roles for this administrator
          </p>
          <div className="space-y-2">
            {roles.map((role) => {
              const isSelected = formData.roleCodes.includes(role.code);
              return (
                <label
                  key={role.code}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-gray-50 dark:bg-gray-800 ring-2 ring-gray-900 dark:ring-white" : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRole(role.code)}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-gray-900 dark:bg-white" : "border-2 border-gray-300 dark:border-gray-600"}`}
                  >
                    {isSelected && (
                      <Check
                        size={14}
                        className="text-white dark:text-gray-900"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {role.desc}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {role.code}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          {formData.roleCodes.length === 0 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              ⚠️ Please select at least one role
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AdminFormModal;
