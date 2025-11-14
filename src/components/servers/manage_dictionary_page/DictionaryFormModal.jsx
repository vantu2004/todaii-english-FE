import { useState, useEffect } from "react";
import Modal from "../Modal";
import { Plus, Trash2, BookOpen } from "lucide-react";

const POS_OPTIONS = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "pronoun",
  "determiner",
  "preposition",
  "conjunction",
  "interjection",
  "phrase",
];

const emptySense = () => ({
  pos: "noun",
  meaning: "",
  definition: "",
  example: "",
  synonyms: [],
  collocations: [],
});

const DictionaryFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = {},
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    headword: "",
    ipa: "",
    audio_url: "",
    senses: [emptySense()],
  });

  const isCreate = mode === "create";

  useEffect(() => {
    if (mode === "update" && initialData) {
      setFormData({
        headword: initialData.headword || "",
        ipa: initialData.ipa || "",
        audio_url: initialData.audio_url || "",
        senses: initialData.senses?.length
          ? initialData.senses
          : [emptySense()],
      });
    } else {
      setFormData({
        headword: "",
        ipa: "",
        audio_url: "",
        senses: [emptySense()],
      });
    }
  }, [mode, initialData, isOpen]);

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSenseChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.senses];
      updated[index][field] = value;
      return { ...prev, senses: updated };
    });
  };

  const handleArrayChange = (index, field, value) => {
    const arr = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    handleSenseChange(index, field, arr);
  };

  const handleAddSense = () => {
    setFormData((prev) => ({
      ...prev,
      senses: [...prev.senses, emptySense()],
    }));
  };

  const handleRemoveSense = (index) => {
    setFormData((prev) => ({
      ...prev,
      senses: prev.senses.filter((_, i) => i !== index),
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
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isCreate ? "Create Dictionary Entry" : "Update Dictionary Entry"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isCreate
                ? "Add a new word to the dictionary"
                : "Modify word details and meanings"}
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
            {isCreate ? "Create Entry" : "Save Changes"}
          </button>
        </div>
      }
      width="max-w-5xl"
    >
      <div className="space-y-5">
        {/* Headword */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <BookOpen size={16} className="text-blue-600" />
            Headword
          </label>
          <input
            type="text"
            value={formData.headword}
            onChange={(e) => updateField("headword", e.target.value)}
            placeholder="Enter word"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        </div>

        {/* IPA */}
        <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <BookOpen size={16} className="text-purple-600" />
            IPA
          </label>
          <input
            type="text"
            value={formData.ipa}
            onChange={(e) => updateField("ipa", e.target.value)}
            placeholder="/ˈhæpi/"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
          />
        </div>

        {/* Audio URL */}
        <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl p-6 border border-green-200/50 hover:border-green-300 hover:shadow-md transition-all">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <BookOpen size={16} className="text-green-600" />
            Audio URL
          </label>
          <input
            type="text"
            value={formData.audio_url}
            onChange={(e) => updateField("audio_url", e.target.value)}
            placeholder="https://example.com/audio.mp3"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
          />
        </div>

        {/* Senses */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-600" />
              Senses
            </h4>
            <button
              onClick={handleAddSense}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium transition-all transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Add Sense
            </button>
          </div>

          {formData.senses.map((sense, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-600" />
                  Sense #{i + 1}
                </h5>
                {formData.senses.length > 1 && (
                  <button
                    onClick={() => handleRemoveSense(i)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* POS & Meaning */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-200/50">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Part of Speech
                  </label>
                  <select
                    value={sense.pos}
                    onChange={(e) =>
                      handleSenseChange(i, "pos", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  >
                    {POS_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-xl p-4 border border-green-200/50">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Meaning (VN)
                  </label>
                  <input
                    type="text"
                    value={sense.meaning}
                    onChange={(e) =>
                      handleSenseChange(i, "meaning", e.target.value)
                    }
                    placeholder="Nghĩa tiếng Việt..."
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Definition */}
              <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-4 border border-purple-200/50">
                <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                  Definition (EN)
                </label>
                <textarea
                  value={sense.definition}
                  onChange={(e) =>
                    handleSenseChange(i, "definition", e.target.value)
                  }
                  placeholder="English definition..."
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all h-20 resize-none"
                />
              </div>

              {/* Example */}
              <div className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-xl p-4 border border-amber-200/50">
                <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                  Example
                </label>
                <textarea
                  value={sense.example}
                  onChange={(e) =>
                    handleSenseChange(i, "example", e.target.value)
                  }
                  placeholder="Example sentence..."
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all h-20 resize-none"
                />
              </div>

              {/* Synonyms & Collocations */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-slate-50 to-green-50 rounded-xl p-4 border border-green-200/50">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Synonyms (comma separated)
                  </label>
                  <input
                    type="text"
                    value={sense.synonymsInput || sense.synonyms.join(", ")}
                    onChange={(e) => {
                      handleSenseChange(i, "synonymsInput", e.target.value);
                      handleArrayChange(i, "synonyms", e.target.value);
                    }}
                    placeholder="e.g. joyful, glad"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-200/50">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                    Collocations (comma separated)
                  </label>
                  <input
                    type="text"
                    value={
                      sense.collocationsInput || sense.collocations.join(", ")
                    }
                    onChange={(e) => {
                      handleSenseChange(i, "collocationsInput", e.target.value);
                      handleArrayChange(i, "collocations", e.target.value);
                    }}
                    placeholder="e.g. make progress, take place"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default DictionaryFormModal;
