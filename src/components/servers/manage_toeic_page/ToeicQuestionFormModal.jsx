import { useState, useEffect } from "react";
import Modal from "@/components/servers/Modal";
import {
  Save,
  Image as ImageIcon,
  FileAudio,
  FileText,
  CheckSquare,
  AlignLeft,
  Tags,
} from "lucide-react";
import {
  uploadToeicTestFile,
  deleteToeicTestFile,
} from "@/api/servers/toeicTestApi";
import {
  createPart12Question,
  updatePart12Question,
  createPart34567Question,
  updatePart34567Question,
} from "@/api/servers/toeicQuestionApi";
import { logError } from "@/utils/LogError";
import toast from "react-hot-toast";

const ToeicQuestionFormModal = ({
  isOpen,
  onClose,
  initialData,
  partNumber,
  testId,
  passages,
  tags,
  onSuccess,
}) => {
  const isUpdate = !!initialData;
  const isPart12 = partNumber === 1 || partNumber === 2;
  const isPart5 = partNumber === 5;
  const isPart6 = partNumber === 6;

  const [formData, setFormData] = useState({
    transcript: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAns: "A",
    explanation: "",
    passageId: "",
    tagIds: [],
    imageUrl: "",
    audioUrl: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [isDeletingAudio, setIsDeletingAudio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        transcript: initialData.transcript || "",
        question: initialData.question || "",
        optionA: initialData.option_a || "",
        optionB: initialData.option_b || "",
        optionC: initialData.option_c || "",
        optionD: initialData.option_d || "",
        correctAns: initialData.correct_ans || "A",
        explanation: initialData.explanation || "",
        passageId: initialData.passage_id || "",
        tagIds: initialData.tags?.map((t) => t.id) || initialData.tag_ids || [],
        imageUrl:
          initialData.image_request?.uploaded_image ||
          initialData.image_request?.image_url ||
          "",
        audioUrl:
          initialData.audio_request?.uploaded_audio ||
          initialData.audio_request?.audio_url ||
          "",
      });
    } else {
      setFormData({
        transcript: "",
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAns: "A",
        explanation: "",
        passageId: passages?.length > 0 ? passages[0].id : "",
        tagIds: [],
        imageUrl: "",
        audioUrl: "",
      });
    }
  }, [initialData, passages]);

  const handleUploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image") setIsUploadingImage(true);
    else setIsUploadingAudio(true);

    try {
      const url = await uploadToeicTestFile(testId, file);
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "imageUrl" : "audioUrl"]: url,
      }));
      toast.success(
        `${type === "image" ? "Image" : "Audio"} uploaded successfully!`,
      );
    } catch (err) {
      logError(err);
      toast.error(`Failed to upload ${type}`);
    } finally {
      if (type === "image") setIsUploadingImage(false);
      else setIsUploadingAudio(false);
      e.target.value = null;
    }
  };

  const handleDeleteFile = async (type) => {
    const url = type === "image" ? formData.imageUrl : formData.audioUrl;
    if (!url) return;

    if (type === "image") setIsDeletingImage(true);
    else setIsDeletingAudio(true);

    try {
      if (url.includes("cloudinary")) {
        await deleteToeicTestFile(url);
      }
      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "imageUrl" : "audioUrl"]: "",
      }));
      toast.success(`${type === "image" ? "Image" : "Audio"} removed!`);
    } catch (err) {
      logError(err);
      toast.error(`Failed to delete ${type}`);
    } finally {
      if (type === "image") setIsDeletingImage(false);
      else setIsDeletingAudio(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleTag = (tagId) => {
    setFormData((prev) => {
      const isSelected = prev.tagIds.includes(tagId);
      if (isSelected) {
        return { ...prev, tagIds: prev.tagIds.filter((id) => id !== tagId) };
      } else {
        if (prev.tagIds.length >= 5) {
          toast.error("Maximum 5 tags allowed");
          return prev;
        }
        return { ...prev, tagIds: [...prev.tagIds, tagId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tagIds.length === 0) {
      toast.error("At least one tag must be selected");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isPart12) {
        console.log("part 12 hereeee!!");
        const payload = {
          correct_ans: formData.correctAns,
          transcript: formData.transcript,
          explanation: formData.explanation,
          tag_ids: formData.tagIds,
          image_request: {
            uploaded_image: formData.imageUrl?.includes("cloudinary")
              ? formData.imageUrl
              : "",
            image_url: !formData.imageUrl?.includes("cloudinary")
              ? formData.imageUrl
              : "",
          },
          audio_request: {
            uploaded_audio: formData.audioUrl?.includes("cloudinary")
              ? formData.audioUrl
              : "",
            audio_url: !formData.audioUrl?.includes("cloudinary")
              ? formData.audioUrl
              : "",
          },
        };

        console.log("payload: ", payload);

        if (isUpdate) {
          await updatePart12Question(initialData.id, payload);
          toast.success("Question updated successfully");
        } else {
          await createPart12Question(testId, partNumber, payload);
          toast.success("Question created successfully");
        }
      } else {
        const payload = {
          question: formData.question,
          option_a: formData.optionA,
          option_b: formData.optionB,
          option_c: formData.optionC,
          option_d: formData.optionD,
          correct_ans: formData.correctAns,
          explanation: formData.explanation,
          tag_ids: formData.tagIds,
          passage_id: !isPart5 ? Number(formData.passageId) : null,
        };

        if (isUpdate) {
          await updatePart34567Question(initialData.id, payload);
          toast.success("Question updated successfully");
        } else {
          await createPart34567Question(testId, partNumber, payload);
          toast.success("Question created successfully");
        }
      }
      onSuccess();
    } catch (err) {
      logError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isUpdate
          ? `Update Question (Part ${partNumber})`
          : `Create Question (Part ${partNumber})`
      }
      width="sm:max-w-4xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : "Save Question"}
          </button>
        </div>
      }
    >
      <form className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PASSAGE SELECTION (Part 3, 4, 6, 7) */}
          {!isPart12 && !isPart5 && (
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <AlignLeft size={16} className="text-blue-600" />
                Select Passage <span className="text-red-500">*</span>
              </label>
              <select
                name="passageId"
                value={formData.passageId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
              >
                <option value="">-- Select a passage --</option>
                {passages?.map((p) => (
                  <option key={p.id} value={p.id}>
                    Passage #{p.id} - {p.passageText?.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* QUESTION TEXT */}
          {!isPart12 && (
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FileText size={16} className="text-blue-600" />
                Question Text{" "}
                {!isPart6 && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                rows={3}
                required={!isPart6}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
              />
            </div>
          )}

          {/* TRANSCRIPT (Part 1, 2) */}
          {isPart12 && (
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FileText size={16} className="text-blue-600" />
                Transcript <span className="text-red-500">*</span>
              </label>
              <textarea
                name="transcript"
                value={formData.transcript}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
              />
            </div>
          )}

          {/* OPTIONS (Part 3-7) */}
          {!isPart12 && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Option A <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Option B <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Option C <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="optionC"
                  value={formData.optionC}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Option D <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="optionD"
                  value={formData.optionD}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
                />
              </div>
            </>
          )}

          {/* CORRECT ANSWER */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <CheckSquare size={16} className="text-green-600" />
              Correct Answer <span className="text-red-500">*</span>
            </label>
            <select
              name="correct_ans"
              value={formData.correctAns}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white outline-none font-bold"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              {(!isPart12 || partNumber === 1) && <option value="D">D</option>}
            </select>
          </div>

          {/* TAGS */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Tags size={16} className="text-blue-600" />
              Tags (Select up to 5) <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-750">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 hover:border-blue-400 transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
            {formData.tagIds.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Please select at least one tag
              </p>
            )}
          </div>

          {/* EXPLANATION */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={16} className="text-gray-600" />
              Explanation <span className="text-red-500">*</span>
            </label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none"
            />
          </div>

          {/* MEDIA UPLOADS (Part 1, 2) */}
          {isPart12 && (
            <>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <ImageIcon size={16} className="text-blue-600" />
                    Image URL{" "}
                    {partNumber === 1 && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <div className="flex gap-2 items-center">
                    <label
                      className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${isUploadingImage ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {isUploadingImage ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadFile(e, "image")}
                      />
                    </label>
                    {formData.imageUrl?.includes("cloudinary") && (
                      <button
                        type="button"
                        onClick={() => handleDeleteFile("image")}
                        disabled={isDeletingImage}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        {isDeletingImage ? "Removing..." : "Remove Uploaded"}
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none mb-3"
                  disabled={formData.imageUrl?.includes("cloudinary")}
                  required={partNumber === 1}
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-auto object-cover rounded max-h-48 border border-gray-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <FileAudio size={16} className="text-blue-600" />
                    Audio URL <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <label
                      className={`cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors ${isUploadingAudio ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {isUploadingAudio ? "Uploading..." : "Upload Audio"}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => handleUploadFile(e, "audio")}
                      />
                    </label>
                    {formData.audioUrl?.includes("cloudinary") && (
                      <button
                        type="button"
                        onClick={() => handleDeleteFile("audio")}
                        disabled={isDeletingAudio}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors"
                      >
                        {isDeletingAudio ? "Removing..." : "Remove Uploaded"}
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  name="audioUrl"
                  value={formData.audioUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white outline-none mb-3"
                  disabled={formData.audioUrl?.includes("cloudinary")}
                  required
                />
                {formData.audioUrl && (
                  <audio controls className="w-full" src={formData.audioUrl}>
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default ToeicQuestionFormModal;
