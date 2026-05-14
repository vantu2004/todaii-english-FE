import { useEffect, useState } from "react";
import Modal from "@/components/servers/Modal";
import { Shield, Mail, Lock, User, Crown } from "lucide-react";

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
    {
      code: "SUPER_ADMIN",
      desc: "Super Admin",
      color: "from-red-500 to-pink-600",
      icon: Crown,
    },
    {
      code: "USER_MANAGER",
      desc: "User Manager",
      color: "from-blue-500 to-indigo-600",
      icon: User,
    },
    {
      code: "CONTENT_MANAGER",
      desc: "Content Manager",
      color: "from-green-500 to-emerald-600",
      icon: Shield,
    },
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
      setFormData({
        email: "",
        password: "",
        displayName: "",
        roleCodes: [],
      });
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
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <Shield className="text-neutral-700 dark:text-neutral-300" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {isCreate ? "Create Admin Account" : "Update Admin Account"}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isCreate
                ? "Add a new administrator"
                : "Modify admin details and permissions"}
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
            {isCreate ? "Create Admin" : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Email Field */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
            <Mail size={16} className="text-neutral-500 dark:text-neutral-400" />
            Email Address {isCreate && <span className="text-red-500">*</span>}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="admin@example.com"
            disabled={!isCreate}
            className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 ${
              isCreate
                ? "border-neutral-200 dark:border-neutral-700 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20"
                : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
            }`}
          />
          {!isCreate && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 flex items-center gap-1">
              <Lock size={12} />
              Email cannot be changed
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
            <Lock size={16} className="text-neutral-500 dark:text-neutral-400" />
            Password {isCreate && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder={
              isCreate ? "Enter secure password" : "Leave blank to keep current"
            }
            className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20"
          />
          {!isCreate && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5">
              Only enter a new password if you want to change it
            </p>
          )}
        </div>

        {/* Display Name Field */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
            <User size={16} className="text-neutral-500 dark:text-neutral-400" />
            Display Name
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={(e) => updateField("displayName", e.target.value)}
            placeholder="e.g., Nguyen Van A"
            className="w-full px-4 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none transition-colors bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20"
          />
        </div>

        {/* Roles Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-5 ring-1 ring-neutral-200 dark:ring-neutral-800">
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 uppercase tracking-wide">
            <Shield size={16} className="text-neutral-500 dark:text-neutral-400" />
            Admin Roles & Permissions
          </label>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            Select one or more roles for this administrator
          </p>

          <div className="grid grid-cols-1 gap-3">
            {roles.map((role) => {
              const isSelected = formData.roleCodes.includes(role.code);
              const Icon = role.icon;

              return (
                <label
                  key={role.code}
                  className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-neutral-50 dark:bg-neutral-800 ring-2 ring-neutral-900 dark:ring-white"
                      : "bg-white dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRole(role.code)}
                    className="hidden"
                  />

                  <div
                    className={`p-2 rounded-lg flex-shrink-0 ${
                      isSelected ? "bg-neutral-200 dark:bg-neutral-700" : "bg-neutral-100 dark:bg-neutral-800/50"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isSelected ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"}
                    />
                  </div>

                  <div className="flex-1">
                    <div
                      className={`font-semibold text-sm ${
                        isSelected ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {role.desc}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isSelected ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-500 dark:text-neutral-500"
                      }`}
                    >
                      {role.code}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-white dark:bg-neutral-900 rounded-full"></div>
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          {formData.roleCodes.length === 0 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-3 flex items-center gap-1">
              ⚠️ Please select at least one role
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AdminFormModal;
