import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchArticle } from "@/api/servers/articleApi";
import { fetchVideo } from "@/api/servers/videoApi";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  autoGenerateQuestions,
} from "@/api/servers/questionApi";
import { motion } from "framer-motion";
import Modal from "@/components/servers/Modal";
import {
  ArrowLeft,
  Plus,
  Sparkles,
  Trash2,
  Pencil,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { logError } from "@/utils/LogError";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";

const ManageQuestions = () => {
  const { setHeader } = useHeaderContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [topicType, setTopicType] = useState("ARTICLE");
  const [targetTitle, setTargetTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Form states
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [form, setForm] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    explanation: "",
  });

  // AI Gen states
  const [aiCount, setAiCount] = useState(3);
  const [generatingAi, setGeneratingAi] = useState(false);

  const [deleteId, setDeleteId] = useState(null);

  const isArticle = window.location.pathname.includes("/article");

  useEffect(() => {
    const type = isArticle ? "ARTICLE" : "VIDEO";
    setTopicType(type);

    setHeader({
      title: isArticle ? "Manage Articles" : "Manage Videos",
      breadcrumb: [
        { label: "Home", to: "/server" },
        {
          label: isArticle ? "Manage Articles" : "Manage Videos",
          to: isArticle ? "/server/article" : "/server/video",
        },
        { label: "Manage Questions" },
      ],
    });
  }, [isArticle]);

  const loadData = async () => {
    try {
      setLoading(true);
      const targetId = Number(id);

      // Fetch target metadata (title)
      if (isArticle) {
        const articleData = await fetchArticle(targetId);
        setTargetTitle(articleData.title || "");
      } else {
        const videoData = await fetchVideo(targetId);
        setTargetTitle(videoData.title || "");
      }

      // Fetch questions
      const questionList = await getQuestions(
        isArticle ? "ARTICLE" : "VIDEO",
        targetId,
      );
      setQuestions(questionList || []);
    } catch (err) {
      logError(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, isArticle]);

  const handleOpenCreateModal = () => {
    setSelectedQuestion(null);
    setForm({
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_option: "A",
      explanation: "",
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setSelectedQuestion(q);
    setForm({
      question_text: q.question_text || "",
      option_a: q.option_a || "",
      option_b: q.option_b || "",
      option_c: q.option_c || "",
      option_d: q.option_d || "",
      correct_option: q.correct_option || "A",
      explanation: q.explanation || "",
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.question_text ||
      !form.option_a ||
      !form.option_b ||
      !form.option_c ||
      !form.option_d
    ) {
      toast.error("Please fill in all options and question text");
      return;
    }

    try {
      const payload = {
        topic_type: topicType,
        content_id: Number(id),
        question_text: form.question_text,
        option_a: form.option_a,
        option_b: form.option_b,
        option_c: form.option_c,
        option_d: form.option_d,
        correct_option: form.correct_option,
        explanation: form.explanation,
      };

      if (selectedQuestion) {
        await updateQuestion(selectedQuestion.id, payload);
        toast.success("Question updated successfully");
      } else {
        await createQuestion(payload);
        toast.success("Question created successfully");
      }
      setIsFormModalOpen(false);
      loadData();
    } catch (err) {
      logError(err);
      toast.error("Failed to save question");
    }
  };

  const handleOpenDeleteModal = (qid) => {
    setDeleteId(qid);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteQuestion(deleteId);
      toast.success("Question deleted successfully");
      setIsDeleteModalOpen(false);
      loadData();
    } catch (err) {
      logError(err);
      toast.error("Failed to delete question");
    }
  };

  const handleAiGenerate = async () => {
    try {
      setGeneratingAi(true);
      await autoGenerateQuestions(topicType, Number(id), aiCount);
      toast.success("Questions auto-generated successfully");
      setIsAiModalOpen(false);
      loadData();
    } catch (err) {
      logError(err);
      toast.error("AI Generation failed");
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading data...</div>;
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to list</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Auto-Generate</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>

          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
            aria-label="Reload"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target description banner */}
      <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
              {topicType === "ARTICLE" ? "Article" : "Video"} Questions
            </span>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mt-0.5 line-clamp-1">
              {targetTitle}
            </h2>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-850 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
            Total: {questions.length} questions
          </span>
        </div>
      </div>

      {/* Table grid */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-auto border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900"
      >
        {questions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No questions generated for this item yet. Use the "AI Auto-Generate"
            or "Add Question" button to start.
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-xs font-semibold text-left text-gray-500 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 w-16">ID</th>
                <th className="px-4 py-3">Question Text</th>
                <th className="px-4 py-3 w-32">Correct Option</th>
                <th className="px-4 py-3 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm text-gray-700 dark:text-gray-300">
              {questions.map((q) => (
                <tr
                  key={q.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                >
                  <td className="px-4 py-3 font-mono text-xs">{q.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                      {q.question_text}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>A: {q.option_a}</span>
                      <span>B: {q.option_b}</span>
                      <span>C: {q.option_c}</span>
                      <span>D: {q.option_d}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                    Option {q.correct_option}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(q.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {/* Question Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedQuestion ? "Edit Question" : "Add Question"}
        width="sm:max-w-xl"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Save Question
            </button>
          </div>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question Text *
            </label>
            <textarea
              required
              rows={3}
              value={form.question_text}
              onChange={(e) =>
                setForm({ ...form, question_text: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-850 dark:text-white"
              placeholder="e.g., What is the key point explained in this section?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Option A *
              </label>
              <input
                type="text"
                required
                value={form.option_a}
                onChange={(e) => setForm({ ...form, option_a: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-850 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Option B *
              </label>
              <input
                type="text"
                required
                value={form.option_b}
                onChange={(e) => setForm({ ...form, option_b: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-850 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Option C *
              </label>
              <input
                type="text"
                required
                value={form.option_c}
                onChange={(e) => setForm({ ...form, option_c: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-850 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Option D *
              </label>
              <input
                type="text"
                required
                value={form.option_d}
                onChange={(e) => setForm({ ...form, option_d: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-850 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correct Option *
            </label>
            <select
              value={form.correct_option}
              onChange={(e) =>
                setForm({ ...form, correct_option: e.target.value })
              }
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-850 dark:text-white"
            >
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Explanation (Optional)
            </label>
            <textarea
              rows={3}
              value={form.explanation}
              onChange={(e) =>
                setForm({ ...form, explanation: e.target.value })
              }
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-850 dark:text-white"
              placeholder="Detailed feedback explaining why the correct option is A/B/C/D."
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Question"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        }
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this question? This action cannot be
          undone.
        </p>
      </Modal>

      {/* AI Generate Prompt Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => !generatingAi && setIsAiModalOpen(false)}
        title="AI Auto-Generate Questions"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button
              type="button"
              disabled={generatingAi}
              onClick={() => setIsAiModalOpen(false)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={generatingAi}
              onClick={handleAiGenerate}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {generatingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Select the number of practice questions you want to automatically
            generate using AI for this {topicType.toLowerCase()}.
          </p>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Questions Count:
            </label>
            <select
              value={aiCount}
              disabled={generatingAi}
              onChange={(e) => setAiCount(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 dark:bg-gray-850 dark:text-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "question" : "questions"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageQuestions;
