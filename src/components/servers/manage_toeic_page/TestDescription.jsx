import { FileText } from "lucide-react";

const TestDescription = ({ formData, handleChange }) => {
  return (
    <div className="md:col-span-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
        <FileText size={16} className="text-blue-600 dark:text-blue-400" />
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        placeholder="Describe this test..."
        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm resize-none"
      />
    </div>
  );
};

export default TestDescription;
