import { Type, LayoutList, Clock, Layers, ToggleLeft } from "lucide-react";

const TestBasicDetails = ({ formData, handleChange, collections }) => {
  return (
    <>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., ETS 2024 Test 1"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test Type
        </label>
        <select
          name="test_type"
          value={formData.test_type}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white outline-none transition-all"
        >
          <option value="TOEIC_LR">TOEIC LR</option>
          <option value="TOEIC_SW">TOEIC SW</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Duration (mins)
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Collection
        </label>
        <select
          name="collection_id"
          value={formData.collection_id}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white outline-none transition-all"
        >
          <option value="">-- Select a Collection --</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 dark:bg-gray-700 dark:text-white outline-none transition-all"
        >
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>
    </>
  );
};

export default TestBasicDetails;
