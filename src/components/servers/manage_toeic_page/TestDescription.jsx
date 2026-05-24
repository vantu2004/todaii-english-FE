import { FileText } from "lucide-react";

const TestDescription = ({ formData, handleChange }) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        placeholder="Describe this test..."
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white outline-none transition-all resize-none"
      />
    </div>
  );
};

export default TestDescription;
