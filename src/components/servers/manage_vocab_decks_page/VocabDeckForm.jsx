import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchVocabGroupsNoPaged } from "../../../api/servers/vocabGroupApi"; // API groups
import { logError } from "../../../utils/LogError";

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const VocabDeckForm = ({ mode = "create", initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    cefr_level: initialData.cefr_level || "A1",
    group_ids:
      initialData.group_ids || initialData.groups?.map((g) => g.id) || [],
  });

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      description: initialData.description || "",
      cefr_level: initialData.cefr_level || "A1",
      group_ids:
        initialData.group_ids || initialData.groups?.map((g) => g.id) || [],
    });
  }, [initialData]);

  const fetchGroups = async () => {
    try {
      const data = await fetchVocabGroupsNoPaged();
      setGroups(data || []);
    } catch (err) {
      logError(err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleGroup = (id) => {
    setFormData((prev) => ({
      ...prev,
      group_ids: prev.group_ids.includes(id)
        ? prev.group_ids.filter((g) => g !== id)
        : [...prev.group_ids, id],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...initialData, ...formData };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-50"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-b-lg px-8 py-3 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {mode === "create"
              ? "Add New Vocabulary Deck"
              : "Update Vocabulary Deck"}
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            {mode === "create"
              ? "Fill in the details to create a new deck"
              : "Modify deck details and update information"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {mode === "create" ? "New" : "Updating"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT FORM AREA */}
          <div className="lg:col-span-2 space-y-6">
            {/* NAME */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Deck Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                placeholder="Enter deck name"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* DESCRIPTION */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                rows={4}
                onChange={handleChange}
                placeholder="Enter deck description"
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </motion.div>

            {/* CEFR */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                CEFR Level <span className="text-red-500">*</span>
              </label>
              <select
                name="cefr_level"
                value={formData.cefr_level}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {CEFR_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* RIGHT: GROUPS */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-slate-200 rounded-xl p-6 sticky top-8 shadow-md"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                <h3 className="font-bold text-slate-900">
                  Groups <span className="text-red-500">*</span>
                </h3>
              </div>

              <p className="text-xs text-slate-500 mb-4 font-medium">
                {formData.group_ids.length} of {groups.length} selected
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {groups.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Loading...
                  </p>
                ) : (
                  groups.map((group) => (
                    <motion.label
                      key={group.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.group_ids.includes(group.id)}
                        onChange={() => toggleGroup(group.id)}
                        className="w-5 h-5 rounded border-slate-300 cursor-pointer appearance-none bg-white border transition-all"
                        style={{
                          backgroundImage: formData.group_ids.includes(group.id)
                            ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.207 5.207L6.5 11.914 2.793 8.207'/%3E%3C/svg%3E")`
                            : "none",
                          backgroundColor: formData.group_ids.includes(group.id)
                            ? "#2563eb"
                            : "white",
                          borderColor: formData.group_ids.includes(group.id)
                            ? "#2563eb"
                            : "#cbd5e1",
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {group.name}
                      </span>
                    </motion.label>
                  ))
                )}
              </div>

              {/* Selected Groups */}
              {formData.group_ids.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 pt-4 border-t border-slate-200"
                >
                  <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide">
                    Selected Groups
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {groups
                      .filter((g) => formData.group_ids.includes(g.id))
                      .map((group) => (
                        <motion.span
                          key={group.id}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full border border-blue-200"
                        >
                          {group.name}
                        </motion.span>
                      ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-8 py-4 flex justify-end gap-3 shadow-lg">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all active:scale-95 shadow-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:shadow-lg hover:scale-105 transition-all active:scale-95 shadow-md"
        >
          {mode === "create" ? "Create Deck" : "Update Deck"}
        </button>
      </div>
    </form>
  );
};

export default VocabDeckForm;
