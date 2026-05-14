import { useState, useEffect } from "react";
import Modal from "@/components/servers/Modal";
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
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isCreate ? "Create Dictionary Entry" : "Update Dictionary Entry"}
          </h2>
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
            onClick={() => onSubmit(formData)}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            {isCreate ? "Create Entry" : "Save Changes"}
          </button>
        </div>
      }
      width="max-w-5xl"
    >
      <div className="space-y-5">
        {/* Headword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Headword
          </label>
          <input
            type="text"
            value={formData.headword}
            onChange={(e) => updateField("headword", e.target.value)}
            placeholder="Enter word"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
          />
        </div>

        {/* IPA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IPA
          </label>
          <input
            type="text"
            value={formData.ipa}
            onChange={(e) => updateField("ipa", e.target.value)}
            placeholder="/ˈhæpi/"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
          />
        </div>

        {/* Audio URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Audio URL
          </label>
          <input
            type="text"
            value={formData.audio_url}
            onChange={(e) => updateField("audio_url", e.target.value)}
            placeholder="https://example.com/audio.mp3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
          />
        </div>

        {/* Senses */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">Senses</h4>
            <button
              onClick={handleAddSense}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Sense
            </button>
          </div>

          {formData.senses.map((sense, i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-5 border border-gray-200 space-y-4"
            >
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <h5 className="font-semibold text-gray-900">Sense #{i + 1}</h5>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Part of Speech
                  </label>
                  <select
                    value={sense.pos}
                    onChange={(e) =>
                      handleSenseChange(i, "pos", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
                  >
                    {POS_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meaning (VN)
                  </label>
                  <input
                    type="text"
                    value={sense.meaning}
                    onChange={(e) =>
                      handleSenseChange(i, "meaning", e.target.value)
                    }
                    placeholder="Nghĩa tiếng Việt..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Definition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Definition (EN)
                </label>
                <textarea
                  value={sense.definition}
                  onChange={(e) =>
                    handleSenseChange(i, "definition", e.target.value)
                  }
                  placeholder="English definition..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all h-20 resize-none"
                />
              </div>

              {/* Example */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Example
                </label>
                <textarea
                  value={sense.example}
                  onChange={(e) =>
                    handleSenseChange(i, "example", e.target.value)
                  }
                  placeholder="Example sentence..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all h-20 resize-none"
                />
              </div>

              {/* Synonyms & Collocations */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
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
