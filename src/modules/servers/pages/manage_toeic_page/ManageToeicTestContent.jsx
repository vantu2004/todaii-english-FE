import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHeaderContext } from "@/hooks/servers/useHeaderContext";
import { getToeicTestById } from "@/api/servers/toeicTestApi";
import { getQuestionsByPartNumber, deleteQuestion } from "@/api/servers/toeicQuestionApi";
import { getPassagesByPartNumber, deletePassage } from "@/api/servers/toeicPassageApi";
import { logError } from "@/utils/LogError";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import ToeicQuestionsTable from "@/components/servers/manage_toeic_page/ToeicQuestionsTable";
import ToeicPassagesTable from "@/components/servers/manage_toeic_page/ToeicPassagesTable";
import ToeicQuestionFormModal from "@/components/servers/manage_toeic_page/ToeicQuestionFormModal";
import ToeicPassageFormModal from "@/components/servers/manage_toeic_page/ToeicPassageFormModal";
import { fetchAllToeicTags } from "@/api/servers/toeicTagApi";

const PARTS_WITH_PASSAGE = [3, 4, 6, 7];

const ManageToeicTestContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setHeader } = useHeaderContext();

  const [test, setTest] = useState(null);
  const [activePart, setActivePart] = useState(1);
  const [loading, setLoading] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [passages, setPassages] = useState([]);
  const [tags, setTags] = useState([]);

  // Modals state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [isPassageModalOpen, setIsPassageModalOpen] = useState(false);
  const [editingPassage, setEditingPassage] = useState(null);

  const loadTestData = async () => {
    try {
      const testData = await getToeicTestById(id);
      setTest(testData);
      setHeader({
        title: `Manage Content: ${testData.title}`,
        breadcrumb: [
          { label: "Home", to: "/server" },
          { label: "Manage TOEIC Tests", to: "/server/toeic-test" },
          { label: "Test Content" },
        ],
      });
    } catch (err) {
      logError(err);
      toast.error("Failed to load test info");
    }
  };

  const loadTags = async () => {
    try {
      const data = await fetchAllToeicTags();
      setTags(data);
    } catch (err) {
      logError(err);
    }
  };

  const loadContentForPart = async (partNum) => {
    setLoading(true);
    try {
      const qData = await getQuestionsByPartNumber(id, partNum);
      setQuestions(qData);

      if (PARTS_WITH_PASSAGE.includes(partNum)) {
        const pData = await getPassagesByPartNumber(id, partNum);
        setPassages(pData);
      } else {
        setPassages([]);
      }
    } catch (err) {
      logError(err);
      toast.error("Failed to load part content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestData();
    loadTags();
  }, [id]);

  useEffect(() => {
    if (test) {
      loadContentForPart(activePart);
    }
  }, [activePart, test]);

  const handleAddPassage = () => {
    setEditingPassage(null);
    setIsPassageModalOpen(true);
  };

  const handleEditPassage = (passage) => {
    setEditingPassage(passage);
    setIsPassageModalOpen(true);
  };

  const handleDeletePassage = async (passageId) => {
    if (window.confirm("Are you sure you want to delete this passage? It may delete associated questions.")) {
      try {
        await deletePassage(passageId);
        toast.success("Passage deleted");
        loadContentForPart(activePart);
      } catch (err) {
        logError(err);
        toast.error("Failed to delete passage");
      }
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(questionId);
        toast.success("Question deleted");
        loadContentForPart(activePart);
      } catch (err) {
        logError(err);
        toast.error("Failed to delete question");
      }
    }
  };

  if (!test) return <div className="p-8">Loading test...</div>;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg p-6 overflow-y-auto">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        {[1, 2, 3, 4, 5, 6, 7].map((part) => (
          <button
            key={part}
            onClick={() => setActivePart(part)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activePart === part
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Part {part}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading content...</div>
      ) : (
        <motion.div
          key={activePart}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Passages Section */}
          {PARTS_WITH_PASSAGE.includes(activePart) && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Passages (Part {activePart})
                </h3>
                <button
                  onClick={handleAddPassage}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow transition-all"
                >
                  + Add Passage
                </button>
              </div>
              <ToeicPassagesTable
                passages={passages}
                onEdit={handleEditPassage}
                onDelete={handleDeletePassage}
              />
            </div>
          )}

          {/* Questions Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Questions (Part {activePart})
              </h3>
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow transition-all"
              >
                + Add Question
              </button>
            </div>
            <ToeicQuestionsTable
              questions={questions}
              partNumber={activePart}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              passages={passages}
            />
          </div>
        </motion.div>
      )}

      {/* Modals */}
      {isPassageModalOpen && (
        <ToeicPassageFormModal
          isOpen={isPassageModalOpen}
          onClose={() => setIsPassageModalOpen(false)}
          initialData={editingPassage}
          partNumber={activePart}
          testId={test.id}
          onSuccess={() => {
            setIsPassageModalOpen(false);
            loadContentForPart(activePart);
          }}
        />
      )}

      {isQuestionModalOpen && (
        <ToeicQuestionFormModal
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          initialData={editingQuestion}
          partNumber={activePart}
          testId={test.id}
          passages={passages}
          tags={tags}
          onSuccess={() => {
            setIsQuestionModalOpen(false);
            loadContentForPart(activePart);
          }}
        />
      )}
    </div>
  );
};

export default ManageToeicTestContent;
