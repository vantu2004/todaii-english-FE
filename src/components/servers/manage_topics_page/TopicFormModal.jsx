import { useState } from "react";
import Modal from "@/components/servers/Modal";
import { FolderPlus, Tag, FileText, Video, Lightbulb } from "lucide-react";

const TopicFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    topicType: "ARTICLE",
  });

  const topicTypes = [
    {
      value: "ARTICLE",
      label: "Article",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      description: "Text-based content and articles",
    },
    {
      value: "VIDEO",
      label: "Video",
      icon: Video,
      color: "from-purple-500 to-pink-600",
      description: "Video content and tutorials",
    },
  ];

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create New Topic
            </h2>
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            Create Topic
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Topic Name */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Topic Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g., World News, Technology, Science"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Choose a clear, descriptive name for your topic
          </p>
        </div>

        {/* Topic Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Topic Type
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Select the content type for this topic
          </p>

          <div className="grid grid-cols-2 gap-3">
            {topicTypes.map((type) => {
              const isSelected = formData.topicType === type.value;
              const Icon = type.icon;

              return (
                <label
                  key={type.value}
                  className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gray-50 border-gray-900 ring-1 ring-gray-900"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="topicType"
                    value={type.value}
                    checked={isSelected}
                    onChange={(e) => updateField("topicType", e.target.value)}
                    className="hidden"
                  />

                  <div
                    className={`p-2 rounded-md mb-2 ${
                      isSelected
                        ? "bg-white border border-gray-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isSelected ? "text-gray-900" : "text-gray-500"}
                    />
                  </div>

                  <div
                    className={`font-medium text-sm mb-1 ${
                      isSelected ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {type.label}
                  </div>

                  <div className="text-xs text-center text-gray-500">
                    {type.description}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Topic Organization
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Topics help categorize and organize your content. Choose
                meaningful names that reflect the subject matter for easy
                navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TopicFormModal;
