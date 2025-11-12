import { useEffect, useState } from "react";
import Modal from "../Modal";
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
          <div
            className={`p-2 bg-gradient-to-br ${
              isCreate
                ? "from-green-500 to-emerald-600"
                : "from-blue-500 to-indigo-600"
            } rounded-lg`}
          >
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isCreate ? "Create Admin Account" : "Update Admin Account"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
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
            className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className={`px-5 py-2.5 bg-gradient-to-r ${
              isCreate
                ? "from-green-600 to-emerald-600"
                : "from-blue-600 to-indigo-600"
            } text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105`}
          >
            {isCreate ? "Create Admin" : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Email Field */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Mail size={16} className="text-blue-600" />
            Email Address {isCreate && <span className="text-red-500">*</span>}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="admin@example.com"
            disabled={!isCreate}
            className={`w-full px-4 py-2.5 border-2 rounded-xl outline-none transition-all ${
              isCreate
                ? "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                : "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          />
          {!isCreate && (
            <p className="text-xs text-gray-500 mt-2.5 flex items-center gap-1">
              <Lock size={12} />
              Email cannot be changed
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Lock size={16} className="text-purple-600" />
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
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          />
          {!isCreate && (
            <p className="text-xs text-gray-600 mt-2.5">
              Only enter a new password if you want to change it
            </p>
          )}
        </div>

        {/* Display Name Field */}
        <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl p-6 border border-green-200/50 hover:border-green-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <User size={16} className="text-green-600" />
            Display Name
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={(e) => updateField("displayName", e.target.value)}
            placeholder="e.g., Nguyen Van A"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          />
        </div>

        {/* Roles Section */}
        <div className="bg-gradient-to-br from-slate-50 to-orange-50 rounded-2xl p-6 border-2 border-orange-200/50 hover:border-orange-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            <Shield size={16} className="text-orange-600" />
            Admin Roles & Permissions
          </label>
          <p className="text-xs text-gray-600 mb-4">
            Select one or more roles for this administrator
          </p>

          <div className="grid grid-cols-1 gap-3">
            {roles.map((role) => {
              const isSelected = formData.roleCodes.includes(role.code);
              const Icon = role.icon;

              return (
                <label
                  key={role.code}
                  className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all transform ${
                    isSelected
                      ? `bg-gradient-to-r ${role.color} text-white border-transparent shadow-lg hover:shadow-xl scale-[1.02]`
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
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
                      isSelected ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isSelected ? "text-white" : "text-gray-600"}
                    />
                  </div>

                  <div className="flex-1">
                    <div
                      className={`font-semibold text-sm ${
                        isSelected ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {role.desc}
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isSelected ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {role.code}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"></div>
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          {formData.roleCodes.length === 0 && (
            <p className="text-xs text-orange-600 mt-3 flex items-center gap-1">
              ⚠️ Please select at least one role
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AdminFormModal;
