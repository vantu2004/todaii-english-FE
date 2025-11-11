import { useEffect, useState } from "react";
import Modal from "../Modal";

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
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update User"
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
            Save
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
            value={initialData.email}
            placeholder="example@email.com"
            disabled={true}
            className={
              "w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition bg-gray-100 cursor-not-allowed"
            }
          />
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Name
          </label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            placeholder="e.g. Nguyen Van B"
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password{" "}
            <span className="text-gray-500 text-sm italic">
              (Leave blank to keep current)
            </span>
          </label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="•••••• (optional)"
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
          />
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
