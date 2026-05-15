import { Type, LayoutList, Clock, Layers, ToggleLeft } from "lucide-react";

const TestBasicDetails = ({ formData, handleChange, collections }) => {
  return (
    <>
      <div className="md:col-span-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          <Type size={16} className="text-blue-600 dark:text-blue-400" />
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., ETS 2024 Test 1"
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          <LayoutList size={16} className="text-blue-600 dark:text-blue-400" />
          Test Type
        </label>
        <select
          name="test_type"
          value={formData.test_type}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
        >
          <option value="TOEIC_LR">TOEIC LR</option>
          <option value="TOEIC_SW">TOEIC SW</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          <Clock size={16} className="text-blue-600 dark:text-blue-400" />
          Duration (mins)
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="0"
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          <Layers size={16} className="text-blue-600 dark:text-blue-400" />
          Collection
        </label>
        <select
          name="collection_id"
          value={formData.collection_id}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
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
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
          <ToggleLeft size={16} className="text-blue-600 dark:text-blue-400" />
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none transition-all shadow-sm"
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
