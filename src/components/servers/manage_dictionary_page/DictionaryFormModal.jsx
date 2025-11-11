import { useState } from "react";
import Modal from "../Modal";
import { Trash2, Plus, BookOpen } from "lucide-react";

const DictionaryFormModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = {},
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    headword: initialData.headword || "",
    ipa: initialData.ipa || "",
    audioUrl: initialData.audioUrl || "",
    meanings: initialData.meanings || [
      {
        partOfSpeech: "Noun",
        vietnameseMeaning: "",
        englishDefinition: "",
        example: "",
        synonyms: "",
        collocations: "",
      },
    ],
  });

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const updateMeaning = (index, field, value) => {
    const updated = [...formData.meanings];
    updated[index][field] = value;
    updateField("meanings", updated);
  };

  const addMeaning = () => {
    updateField("meanings", [
      ...formData.meanings,
      {
        partOfSpeech: "Noun",
        vietnameseMeaning: "",
        englishDefinition: "",
        example: "",
        synonyms: "",
        collocations: "",
      },
    ]);
  };

  const removeMeaning = (index) => {
    updateField(
      "meanings",
      formData.meanings.filter((_, i) => i !== index)
    );
  };

  const posColors = {
    Noun: "bg-blue-50 text-blue-700 border-blue-200",
    Verb: "bg-green-50 text-green-700 border-green-200",
    Adjective: "bg-purple-50 text-purple-700 border-purple-200",
    Adverb: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === "create" ? "Add New Word" : "Edit Word"}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {mode === "create"
                ? "Create a new dictionary entry"
                : "Update word information"}
            </p>
          </div>
        </div>
      }
      width="sm:max-w-6xl"
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
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            {mode === "create" ? "Create Word" : "Save Changes"}
          </button>
        </div>
      }
    >
      {/* Basic Info */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 mb-6 border border-slate-200">
        <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
          <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
          Basic Information
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Word *"
            value={formData.headword}
            onChange={(e) => updateField("headword", e.target.value)}
            placeholder="e.g., dictionary"
          />
          <Input
            label="IPA Pronunciation"
            value={formData.ipa}
            onChange={(e) => updateField("ipa", e.target.value)}
            placeholder="/ˈdɪkʃəneri/"
          />
          <Input
            label="Audio URL"
            value={formData.audioUrl}
            onChange={(e) => updateField("audioUrl", e.target.value)}
            placeholder="https://example.com/audio.mp3"
          />
        </div>
      </div>

      {/* Meanings Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
            Word Meanings ({formData.meanings.length})
          </h4>
          <button
            onClick={addMeaning}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-all"
          >
            <Plus size={18} />
            Add Meaning
          </button>
        </div>

        <div className="space-y-4">
          {formData.meanings.map((m, idx) => (
            <div
              key={idx}
              className="p-6 border-2 border-gray-200 rounded-2xl bg-white hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${
                      posColors[m.partOfSpeech]
                    }`}
                  >
                    Meaning {idx + 1}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      posColors[m.partOfSpeech]
                    }`}
                  >
                    {m.partOfSpeech}
                  </span>
                </div>
                {formData.meanings.length > 1 && (
                  <button
                    onClick={() => removeMeaning(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Remove meaning"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Select
                    label="Part of Speech *"
                    value={m.partOfSpeech}
                    onChange={(e) =>
                      updateMeaning(idx, "partOfSpeech", e.target.value)
                    }
                    options={["Noun", "Verb", "Adjective", "Adverb"]}
                  />
                  <Input
                    label="Vietnamese Meaning *"
                    value={m.vietnameseMeaning}
                    onChange={(e) =>
                      updateMeaning(idx, "vietnameseMeaning", e.target.value)
                    }
                    placeholder="Nghĩa tiếng Việt"
                  />
                </div>

                <Textarea
                  label="English Definition *"
                  value={m.englishDefinition}
                  onChange={(e) =>
                    updateMeaning(idx, "englishDefinition", e.target.value)
                  }
                  placeholder="A detailed explanation of the word's meaning..."
                  rows={2}
                />

                <Textarea
                  label="Example Sentence"
                  value={m.example}
                  onChange={(e) =>
                    updateMeaning(idx, "example", e.target.value)
                  }
                  placeholder="The dictionary contains thousands of words."
                  rows={2}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Synonyms"
                    value={m.synonyms}
                    onChange={(e) =>
                      updateMeaning(idx, "synonyms", e.target.value)
                    }
                    placeholder="word1, word2, word3"
                    helpText="Separate with commas"
                  />
                  <Input
                    label="Collocations"
                    value={m.collocations}
                    onChange={(e) =>
                      updateMeaning(idx, "collocations", e.target.value)
                    }
                    placeholder="common phrase, typical usage"
                    helpText="Separate with commas"
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

// Reusable Form Components
const Input = ({ label, helpText, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
    />
    {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <textarea
      {...props}
      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default DictionaryFormModal;
