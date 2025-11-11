import { useState } from "react";
import Modal from "../Modal";

const TopicFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    topicType: "ARTICLE", // default
  });

  const topicTypes = [
    { value: "ARTICLE", label: "Article" },
    { value: "VIDEO", label: "Video" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    //setFormData({ name: "", topicType: "ARTICLE" }); // reset form
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Topic"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Create
          </button>
        </>
      }
    >
      <form className="space-y-4">
        {/* Topic Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Topic Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. World"
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
          />
        </div>

        {/* Topic Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Topic Type
          </label>
          <select
            name="topicType"
            value={formData.topicType}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white transition"
          >
            {topicTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default TopicFormModal;
