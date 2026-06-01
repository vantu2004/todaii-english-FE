import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getToeicTestById,
  getQuestionsByPartNumber,
  getPassagesByPartNumber,
} from "@/api/clients/toeicApi";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Menu,
} from "lucide-react";
import toast from "react-hot-toast";

const PARTS = [
  { id: 1, name: "Part 1: Photographs", type: "listening", hasPassage: false },
  {
    id: 2,
    name: "Part 2: Question-Response",
    type: "listening",
    hasPassage: false,
  },
  { id: 3, name: "Part 3: Conversations", type: "listening", hasPassage: true },
  { id: 4, name: "Part 4: Talks", type: "listening", hasPassage: true },
  {
    id: 5,
    name: "Part 5: Incomplete Sentences",
    type: "reading",
    hasPassage: false,
  },
  { id: 6, name: "Part 6: Text Completion", type: "reading", hasPassage: true },
  {
    id: 7,
    name: "Part 7: Reading Comprehension",
    type: "reading",
    hasPassage: true,
  },
];

const calculateInitialTime = (partIds) => {
  const timeMapping = {
    1: 6 * 27, // 162s
    2: 25 * 27, // 675s
    3: 39 * 27, // 1053s
    4: 30 * 27, // 810s
    5: 30 * 45, // 1350s
    6: 16 * 45, // 720s
    7: 54 * 45, // 2430s
  };
  let totalSeconds = 0;
  partIds.forEach((id) => {
    totalSeconds += timeMapping[id] || 0;
  });
  return totalSeconds;
};

const ToeicTakingTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();

  const selectedPartIds = useMemo(() => {
    const params = new URLSearchParams(search);
    const p = params.get("parts");
    if (p) {
      const ids = p
        .split(",")
        .map(Number)
        .filter((id) => id >= 1 && id <= 7);
      if (ids.length > 0) return ids;
    }
    return [1, 2, 3, 4, 5, 6, 7];
  }, [search]);

  const [test, setTest] = useState(null);
  const [testData, setTestData] = useState({ questions: {}, passages: {} }); // partId -> data
  const [loading, setLoading] = useState(true);

  const [currentPart, setCurrentPart] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("parts");
    if (p) {
      const ids = p
        .split(",")
        .map(Number)
        .filter((id) => id >= 1 && id <= 7);
      if (ids.length > 0) return ids[0];
    }
    return 1;
  });

  const [answers, setAnswers] = useState({}); // questionId -> answer ('A', 'B', 'C', 'D')

  const [timeLeft, setTimeLeft] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("parts");
    const ids = p
      ? p
          .split(",")
          .map(Number)
          .filter((id) => id >= 1 && id <= 7)
      : [1, 2, 3, 4, 5, 6, 7];
    return calculateInitialTime(ids.length > 0 ? ids : [1, 2, 3, 4, 5, 6, 7]);
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchTestAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, search]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchTestAllData = async () => {
    try {
      setLoading(true);
      const testInfo = await getToeicTestById(testId);
      setTest(testInfo);

      const allQuestions = {};
      const allPassages = {};

      // Fetch only selected parts concurrently
      await Promise.all(
        PARTS.filter((part) => selectedPartIds.includes(part.id)).map(
          async (part) => {
            const [questionsRes, passagesRes] = await Promise.all([
              getQuestionsByPartNumber(testId, part.id).catch(() => []),
              part.hasPassage
                ? getPassagesByPartNumber(testId, part.id).catch(() => [])
                : Promise.resolve([]),
            ]);
            allQuestions[part.id] = questionsRes || [];
            allPassages[part.id] = passagesRes || [];
          },
        ),
      );

      setTestData({ questions: allQuestions, passages: allPassages });
    } catch (err) {
      console.error("Failed to load test data", err);
      toast.error("Lỗi khi tải dữ liệu bài thi!");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    if (timeLeft > 0) {
      const confirmSubmit = window.confirm(
        "Bạn có chắc chắn muốn nộp bài? Thời gian vẫn còn.",
      );
      if (!confirmSubmit) return;
    }

    const initialTime = calculateInitialTime(selectedPartIds);
    // Store result in local storage or state to pass to result page
    const resultData = {
      testId,
      testName: test?.title,
      answers,
      testData,
      timeSpent: initialTime - timeLeft,
      selectedPartIds,
    };

    localStorage.setItem(`toeic_result_${testId}`, JSON.stringify(resultData));
    navigate(`/client/toeic/${testId}/result`, { replace: true });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const listeningParts = useMemo(() => {
    return PARTS.slice(0, 4).filter((part) =>
      selectedPartIds.includes(part.id),
    );
  }, [selectedPartIds]);

  const readingParts = useMemo(() => {
    return PARTS.slice(4, 7).filter((part) =>
      selectedPartIds.includes(part.id),
    );
  }, [selectedPartIds]);

  const totalQuestionsCount = useMemo(() => {
    const questionCountMapping = {
      1: 6,
      2: 25,
      3: 39,
      4: 30,
      5: 30,
      6: 16,
      7: 54,
    };
    return selectedPartIds.reduce(
      (acc, id) => acc + (questionCountMapping[id] || 0),
      0,
    );
  }, [selectedPartIds]);

  const calculateTotalAnswered = () => {
    let count = 0;
    selectedPartIds.forEach((partId) => {
      const questions = testData.questions[partId] || [];
      questions.forEach((q) => {
        if (answers[q.id]) {
          count++;
        }
      });
    });
    return count;
  };

  const currentPartIndex = selectedPartIds.indexOf(currentPart);
  const hasPreviousPart = currentPartIndex > 0;
  const hasNextPart =
    currentPartIndex !== -1 && currentPartIndex < selectedPartIds.length - 1;

  const handlePreviousPart = () => {
    if (hasPreviousPart) {
      setCurrentPart(selectedPartIds[currentPartIndex - 1]);
    }
  };

  const handleNextPart = () => {
    if (hasNextPart) {
      setCurrentPart(selectedPartIds[currentPartIndex + 1]);
    }
  };

  // Render question UI based on part
  const renderQuestion = (q, index) => {
    const options = ["A", "B", "C", "D"];
    // Part 2 usually has only 3 options (A, B, C)
    const currentOptions = currentPart === 2 ? ["A", "B", "C"] : options;

    return (
      <div
        key={q.id}
        className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-8 h-8 shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300">
            {index + 1}
          </div>
          <div className="flex-1">
            {q.question && (
              <p
                className="text-neutral-900 dark:text-white font-medium mb-3 text-lg"
                dangerouslySetInnerHTML={{ __html: q.question }}
              />
            )}

            {q.image_url && (
              <img
                src={q.image_url}
                alt="Question image"
                className="max-w-md w-full rounded-xl mb-4"
              />
            )}

            {q.audio_url && (
              <audio
                controls
                className="w-full mb-4 max-w-md"
                src={q.audio_url}
              ></audio>
            )}

            <div className="space-y-3 mt-4">
              {currentOptions.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    answers[q.id] === opt
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                      : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question_${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswerSelect(q.id, opt)}
                    className="w-4 h-4 text-brand-500 border-neutral-300 focus:ring-brand-500"
                  />
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300 w-6">
                    {opt}.
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {q[`option_${opt.toLowerCase()}`] || ""}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPartContent = () => {
    const questions = testData.questions[currentPart] || [];
    const passages = testData.passages[currentPart] || [];

    if (questions.length === 0 && passages.length === 0) {
      return (
        <div className="text-center py-12 text-neutral-500">
          Không có dữ liệu cho phần này.
        </div>
      );
    }

    const currentPartInfo = PARTS.find((p) => p.id === currentPart);

    if (currentPartInfo?.hasPassage) {
      // Render passages and their associated questions
      return passages.map((passage, pIndex) => {
        // Find questions belonging to this passage
        const passageQuestions = questions.filter(
          (q) => q.passage_id === passage.id,
        );

        return (
          <div key={passage.id} className="mb-12">
            <div className="mb-6 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-bold mb-4 text-neutral-900 dark:text-white">
                Đoạn văn / Nghe {pIndex + 1}
              </h3>

              {passage.image_url && (
                <img
                  src={passage.image_url}
                  alt="Passage image"
                  className="max-w-full rounded-xl mb-4"
                />
              )}

              {passage.audio_url && (
                <audio
                  controls
                  className="w-full mb-4"
                  src={passage.audio_url}
                ></audio>
              )}

              {passage.passage_text && (
                <div
                  className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200"
                  dangerouslySetInnerHTML={{ __html: passage.passage_text }}
                />
              )}
            </div>

            <div className="pl-0 lg:pl-8 border-l-0 lg:border-l-2 border-neutral-100 dark:border-neutral-800">
              {passageQuestions.map((q, qIndex) => renderQuestion(q, qIndex))}
            </div>
          </div>
        );
      });
    }

    // Render questions without passages
    return questions.map((q, index) => renderQuestion(q, index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium">
            Đang chuẩn bị bài thi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-68px)] bg-neutral-50 dark:bg-neutral-950 flex flex-col mt-[68px]">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-[68px] z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white truncate max-w-[200px] md:max-w-md">
            {test?.title}
          </h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-sm font-medium">
            <CheckCircle2 size={16} className="text-brand-500" />
            <span className="text-neutral-700 dark:text-neutral-300">
              {calculateTotalAnswered()} / {totalQuestionsCount} đã làm
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg ${timeLeft < 300 ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-pulse" : "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"}`}
          >
            <Clock size={20} />
            <span className="w-16 tabular-nums">{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold shadow-sm transition-colors"
          >
            Nộp bài
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <div
          className={`
          absolute lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="p-4">
            {listeningParts.length > 0 && (
              <>
                <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 px-2">
                  Phần Nghe (Listening)
                </h2>
                <div className="space-y-1 mb-6">
                  {listeningParts.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => {
                        setCurrentPart(part.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        currentPart === part.id
                          ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium"
                      }`}
                    >
                      <span className="truncate pr-2">{part.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {readingParts.length > 0 && (
              <>
                <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 px-2">
                  Phần Đọc (Reading)
                </h2>
                <div className="space-y-1">
                  {readingParts.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => {
                        setCurrentPart(part.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        currentPart === part.id
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-medium"
                      }`}
                    >
                      <span className="truncate pr-2">{part.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/40 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {PARTS.find((p) => p.id === currentPart)?.name}
              </h2>
            </div>

            <div className="pb-20">{renderPartContent()}</div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
              <button
                type="button"
                disabled={!hasPreviousPart}
                onClick={handlePreviousPart}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Phần trước</span>
              </button>

              <div className="text-sm font-medium text-neutral-500 font-semibold">
                Phần {currentPartIndex + 1} / {selectedPartIds.length}
              </div>

              <button
                type="button"
                disabled={!hasNextPart}
                onClick={handleNextPart}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">Phần tiếp</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeicTakingTest;
