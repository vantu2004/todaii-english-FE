import { useState, useEffect } from "react";
import Modal from "@/components/servers/Modal";
import { Tag } from "lucide-react";
import toast from "react-hot-toast";

const ToeicTagFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [name, setName] = useState("");
  const [partNumbers, setPartNumbers] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPartNumbers(
        initialData.partNumbers ||
          initialData.part_numbers ||
          initialData.partNumber ||
          initialData.part_number ||
          "",
      );
    } else {
      setName("");
      setPartNumbers("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Tag name is required");
      return;
    }
    const cleaned = partNumbers.trim();
    if (cleaned !== "") {
      const parts = cleaned.split(",").map((p) => p.trim());
      for (const part of parts) {
        const pNum = parseInt(part, 10);
        if (isNaN(pNum) || pNum < 1 || pNum > 7) {
          toast.error(
            "Each part number must be between 1 and 7 (separated by commas)",
          );
          return;
        }
      }
    }
    onSubmit(name, cleaned);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {initialData ? "Edit Tag" : "Create Tag"}
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
            className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium transition-all"
          >
            {initialData ? "Update Tag" : "Create Tag"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Tag Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grammar"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              Part Numbers
            </label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => {
                const isSelected = partNumbers
                  .split(",")
                  .map((p) => p.trim())
                  .includes(String(num));
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      let list = partNumbers
                        ? partNumbers
                            .split(",")
                            .map((p) => p.trim())
                            .filter(Boolean)
                        : [];
                      if (list.includes(String(num))) {
                        list = list.filter((item) => item !== String(num));
                      } else {
                        list = [...list, String(num)];
                      }
                      list.sort((a, b) => Number(a) - Number(b));
                      setPartNumbers(list.join(", "));
                    }}
                    className={`px-3.5 py-2 rounded-lg border text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-gray-900 border-gray-900 text-white dark:bg-white dark:text-gray-900 dark:border-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    Part {num}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ToeicTagFormModal;
