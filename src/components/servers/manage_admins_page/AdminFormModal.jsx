import { useEffect, useState } from "react";
import Modal from "../Modal";
import { form } from "framer-motion/client";

const AdminFormModal = ({
  isOpen,
  onClose,
  mode = "create", // "create" hoặc "update"
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
  const isUpdate = mode === "update";

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        email: initialData.email || "",
        password: initialData.password || "",
        displayName: initialData.display_name || "",
        // Chuyển roles object -> mảng string code
        roleCodes: (initialData.roles || []).map((r) => r.code),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => ({
      ...prev,
      roleCodes: prev.roleCodes.includes(role)
        ? prev.roleCodes.filter((r) => r !== role)
        : [...prev.roleCodes, role],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isCreate ? "Create Admin" : "Update Admin"}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {isCreate ? "Create" : "Save"}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            disabled={isUpdate}
            className={`w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition ${
              isUpdate ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password{" "}
            {isUpdate && (
              <span className="text-gray-500 text-sm">
                (Leave blank to keep current)
              </span>
            )}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={isUpdate ? "•••••• (optional)" : "••••••"}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
          />
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Name
          </label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="e.g. Nguyen Van D"
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
          />
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Roles
          </label>
          <div className="flex flex-wrap gap-3 mt-2">
            {roles.map((role) => (
              <label
                key={role.code}
                className={`px-3 py-1 border rounded-full cursor-pointer text-sm transition ${
                  formData.roleCodes.includes(role.code)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 border-gray-200 hover:bg-blue-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.roleCodes.includes(role.code)}
                  onChange={() => handleRoleToggle(role.code)}
                  className="hidden"
                />
                {role.desc}
              </label>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AdminFormModal;
