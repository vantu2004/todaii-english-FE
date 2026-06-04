import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getTestById } from "@/api/clients/toeicTestApi";
import { getQuestionByPartNumber } from "@/api/clients/toeicQuestionApi";
import { getPassageByPartNumber } from "@/api/clients/toeicPassageApi";
import {
  getSessionDetails,
  saveAnswers,
  submitSession,
} from "@/api/clients/toeicSessionApi";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Menu,
  Map,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

// Sub-components
import QuestionItem from "@/components/clients/toeic_page/QuestionItem";
import PassageGroup from "@/components/clients/toeic_page/PassageGroup";
import QuestionNavigator from "@/components/clients/toeic_page/QuestionNavigator";
import SubmitConfirmDialog from "@/components/clients/toeic_page/SubmitConfirmDialog";

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

  const [sessionId, setSessionId] = useState(null);
  const [session, setSession] = useState(null);
  const [selectedPartIds, setSelectedPartIds] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [test, setTest] = useState(null);
  const [testData, setTestData] = useState({ questions: {}, passages: {} }); // partId -> data
  const [loading, setLoading] = useState(true);

  const [currentPart, setCurrentPart] = useState(1);
  const [answers, setAnswers] = useState({}); // questionId -> answer ('A', 'B', 'C', 'D')
  const [timeLeft, setTimeLeft] = useState(0);
  const [marks, setMarks] = useState(new Set());

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const questionRefs = useRef({});
  const answersRef = useRef(answers);

  // Sync answersRef with answers state for auto-save and beforeunload handlers
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Load answers safely handling both camelCase and snake_case API shapes
  const loadAnswers = (sessionAnswers) => {
    if (!sessionAnswers || !Array.isArray(sessionAnswers)) return {};
    const parsed = {};
    sessionAnswers.forEach((ans) => {
      const qId = ans.question_id || ans.questionId || ans.id;
      const opt = ans.selected_option || ans.selectedOption || ans.answer;
      if (qId && opt) {
        parsed[qId] = opt;
      }
    });
    return parsed;
  };

  // Fetch session details and related test data on mount
  useEffect(() => {
    const fetchSessionAndTestData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(search);
        const sessId = params.get("sessionId");
        if (!sessId) {
          toast.error("Không tìm thấy thông tin phiên thi!");
          navigate("/client/toeic");
          return;
        }
        setSessionId(sessId);

        // 1. Fetch Session Details
        const sessionData = await getSessionDetails(sessId);
        setSession(sessionData);

        // Parse parts_done from session (e.g. "1,2,3")
        let partIds = [1, 2, 3, 4, 5, 6, 7];
        if (sessionData.parts_done) {
          partIds = sessionData.parts_done
            .split(",")
            .map(Number)
            .filter((id) => id >= 1 && id <= 7);
        }
        setSelectedPartIds(partIds);

        // Determine initial current part
        if (partIds.length > 0) {
          setCurrentPart(partIds[0]);
        }

        // Pre-fill answers from session
        if (sessionData.answers) {
          const loadedAnswers = loadAnswers(sessionData.answers);
          setAnswers(loadedAnswers);
        }

        // Setup initial time left
        if (
          sessionData.time_spent !== undefined &&
          sessionData.time_spent !== null
        ) {
          setTimeLeft(Number(sessionData.time_spent));
        } else {
          const durationParam = params.get("duration");
          if (durationParam) {
            setTimeLeft(Number(durationParam) * 60);
          } else {
            setTimeLeft(calculateInitialTime(partIds));
          }
        }

        // 2. Fetch Test Info
        const currentTestId = sessionData.test_id || testId;
        const testInfo = await getTestById(currentTestId);
        setTest(testInfo);

        // 3. Fetch Questions and Passages concurrently
        const allQuestions = {};
        const allPassages = {};

        await Promise.all(
          PARTS.filter((part) => partIds.includes(part.id)).map(
            async (part) => {
              const [questionsRes, passagesRes] = await Promise.all([
                getQuestionByPartNumber(currentTestId, part.id).catch(() => []),
                part.hasPassage
                  ? getPassageByPartNumber(currentTestId, part.id).catch(
                      () => [],
                    )
                  : Promise.resolve([]),
              ]);
              allQuestions[part.id] = questionsRes || [];
              allPassages[part.id] = passagesRes || [];
            },
          ),
        );

        setTestData({ questions: allQuestions, passages: allPassages });
      } catch (err) {
        console.error("Failed to load session/test data", err);
        toast.error("Lỗi khi tải dữ liệu bài thi!");
        navigate("/client/toeic");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndTestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId, search]);

  // Timer Tickdown & Auto Submit
  useEffect(() => {
    if (loading) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, loading]);

  // Auto-Save progress every 2 minutes
  useEffect(() => {
    if (!sessionId || loading) return;
    const autoSaveInterval = setInterval(() => {
      const currentAnswers = answersRef.current;
      const requests = Object.entries(currentAnswers).map(([qId, opt]) => ({
        question_id: Number(qId),
        questionId: Number(qId),
        selected_option: opt,
        selectedOption: opt,
      }));
      saveAnswers(sessionId, requests).catch((err) =>
        console.error("Auto-save failed", err),
      );
    }, 120000);
    return () => clearInterval(autoSaveInterval);
  }, [sessionId, loading]);

  // Warning before unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Bạn có chắc chắn muốn rời đi? Tiến trình làm bài sẽ được lưu.";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Save answers on SPA route change / unmount
  useEffect(() => {
    return () => {
      const currentAnswers = answersRef.current;
      if (sessionId && Object.keys(currentAnswers).length > 0) {
        const requests = Object.entries(currentAnswers).map(([qId, opt]) => ({
          question_id: Number(qId),
          questionId: Number(qId),
          selected_option: opt,
          selectedOption: opt,
        }));
        saveAnswers(sessionId, requests).catch((err) =>
          console.error("Save on unmount failed", err),
        );
      }
    };
  }, [sessionId]);

  // Question Flattening & Numbering
  const allQuestionsFlat = useMemo(() => {
    const flat = [];
    let qNumber = 1;
    selectedPartIds.forEach((partId) => {
      const partQuestions = testData.questions[partId] || [];
      const partPassages = testData.passages[partId] || [];
      const currentPartInfo = PARTS.find((p) => p.id === partId);

      if (currentPartInfo?.hasPassage) {
        partPassages.forEach((passage) => {
          const passageQuestions = partQuestions.filter(
            (q) => q.passage_id === passage.id,
          );
          passageQuestions.forEach((q) => {
            flat.push({
              id: q.id,
              partNumber: partId,
              questionNumber: qNumber++,
            });
          });
        });
        const orphanQuestions = partQuestions.filter((q) => !q.passage_id);
        orphanQuestions.forEach((q) => {
          flat.push({
            id: q.id,
            partNumber: partId,
            questionNumber: qNumber++,
          });
        });
      } else {
        partQuestions.forEach((q) => {
          flat.push({
            id: q.id,
            partNumber: partId,
            questionNumber: qNumber++,
          });
        });
      }
    });
    return flat;
  }, [testData, selectedPartIds]);

  const getQuestionNumber = (questionId) => {
    const q = allQuestionsFlat.find((x) => x.id === questionId);
    return q ? q.questionNumber : 1;
  };

  const handleAnswerSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleToggleMark = (questionId) => {
    setMarks((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const handleSaveAnswers = async (showToast = true) => {
    if (!sessionId) return;
    try {
      setSaving(true);
      const requests = Object.entries(answers).map(([qId, opt]) => ({
        question_id: Number(qId),
        questionId: Number(qId),
        selected_option: opt,
        selectedOption: opt,
      }));
      await saveAnswers(sessionId, requests);
      if (showToast) {
        toast.success("Đã lưu tiến độ làm bài!");
      }
    } catch (err) {
      console.error("Failed to save answers", err);
      if (showToast) {
        toast.error("Không thể lưu tiến độ. Vui lòng kiểm tra kết nối.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleNavigateToQuestion = (questionId) => {
    const question = allQuestionsFlat.find((q) => q.id === questionId);
    if (question) {
      if (question.partNumber !== currentPart) {
        setCurrentPart(question.partNumber);
      }
      setTimeout(() => {
        const el = questionRefs.current[questionId];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const handleAutoSubmit = async () => {
    toast.error("Hết giờ làm bài! Hệ thống đang tự động nộp bài.", {
      id: "timeout-toast",
    });
    await executeSubmit(true);
  };

  const executeSubmit = async () => {
    if (!sessionId) return;
    try {
      setSubmitting(true);
      const requests = Object.entries(answers).map(([qId, opt]) => ({
        question_id: Number(qId),
        questionId: Number(qId),
        selected_option: opt,
        selectedOption: opt,
      }));

      await submitSession(sessionId, requests);

      // Save to localStorage for backward compatibility with ToeicResult.jsx
      const durationParam = new URLSearchParams(search).get("duration");
      const initialTime = durationParam
        ? Number(durationParam) * 60
        : calculateInitialTime(selectedPartIds);
      const timeSpent = Math.max(0, initialTime - timeLeft);

      const resultData = {
        testId,
        testName: test?.title,
        answers,
        testData,
        timeSpent,
        selectedPartIds,
      };
      localStorage.setItem(
        `toeic_result_${testId}`,
        JSON.stringify(resultData),
      );

      setIsSubmitDialogOpen(false);
      toast.success("Nộp bài thành công!");
      navigate(`/client/toeic/${testId}/result?sessionId=${sessionId}`, {
        replace: true,
      });
    } catch (err) {
      console.error("Failed to submit session", err);
      toast.error("Nộp bài thất bại. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
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

  const answeredCount = useMemo(() => {
    return allQuestionsFlat.filter((q) => answers[q.id]).length;
  }, [allQuestionsFlat, answers]);

  const markedCount = useMemo(() => {
    return allQuestionsFlat.filter((q) => marks.has(q.id)).length;
  }, [allQuestionsFlat, marks]);

  const unansweredCount = useMemo(() => {
    return allQuestionsFlat.length - answeredCount;
  }, [allQuestionsFlat, answeredCount]);

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
      const passageElements = passages.map((passage) => {
        const passageQuestions = questions.filter(
          (q) => q.passage_id === passage.id,
        );
        if (passageQuestions.length === 0) return null;
        const firstQ = passageQuestions[0];
        const startNumber = firstQ ? getQuestionNumber(firstQ.id) : 1;
        return (
          <PassageGroup
            key={passage.id}
            passage={passage}
            questions={passageQuestions}
            startNumber={startNumber}
            answers={answers}
            marks={marks}
            onSelectAnswer={handleAnswerSelect}
            onToggleMark={handleToggleMark}
            optionCount={4}
            questionRefs={questionRefs}
          />
        );
      });

      const orphanQuestions = questions.filter((q) => !q.passage_id);
      const orphanElements = orphanQuestions.map((q) => {
        const questionNumber = getQuestionNumber(q.id);
        return (
          <QuestionItem
            key={q.id}
            ref={(el) => {
              questionRefs.current[q.id] = el;
            }}
            question={q}
            questionNumber={questionNumber}
            selectedAnswer={answers[q.id] || null}
            isMarked={marks.has(q.id)}
            onSelectAnswer={handleAnswerSelect}
            onToggleMark={handleToggleMark}
            optionCount={4}
          />
        );
      });

      return (
        <div>
          {passageElements}
          {orphanElements}
        </div>
      );
    }

    // Render standalone questions (Part 1, 2, 5)
    return questions.map((q) => {
      const questionNumber = getQuestionNumber(q.id);
      return (
        <QuestionItem
          key={q.id}
          ref={(el) => {
            questionRefs.current[q.id] = el;
          }}
          question={q}
          questionNumber={questionNumber}
          selectedAnswer={answers[q.id] || null}
          isMarked={marks.has(q.id)}
          onSelectAnswer={handleAnswerSelect}
          onToggleMark={handleToggleMark}
          optionCount={currentPart === 2 ? 3 : 4}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-primary dark:bg-neutral-950">
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
    <div className="h-[calc(100vh-68px)] bg-surface-primary dark:bg-neutral-950 flex flex-col mt-[68px]">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-[68px] z-45">
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
              {answeredCount} / {allQuestionsFlat.length} đã làm
            </span>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg ${
              timeLeft < 300
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-pulse"
                : "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
            }`}
          >
            <Clock size={20} />
            <span className="w-16 tabular-nums">{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setIsSubmitDialogOpen(true)}
            className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold shadow-sm transition-colors"
          >
            Nộp bài
          </button>

          <button
            type="button"
            className="xl:hidden p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            title="Bản đồ câu hỏi"
          >
            <Map size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar Parts switcher */}
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

        {/* Backdrop for mobile left sidebar */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/40 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-surface-primary dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {PARTS.find((p) => p.id === currentPart)?.name}
              </h2>
            </div>

            <div className="pb-20">{renderPartContent()}</div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 lg:left-64 right-0 xl:right-80 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
              <button
                type="button"
                disabled={!hasPreviousPart}
                onClick={handlePreviousPart}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Phần trước</span>
              </button>

              <div className="text-sm font-semibold text-neutral-500">
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

        {/* Right Sidebar: Question Navigator for Desktop */}
        <div className="hidden xl:block w-80 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col h-full">
          <QuestionNavigator
            questions={allQuestionsFlat}
            answers={answers}
            marks={marks}
            onNavigateToQuestion={handleNavigateToQuestion}
            onSave={() => handleSaveAnswers(true)}
            onSubmit={() => setIsSubmitDialogOpen(true)}
            saving={saving}
            submitting={submitting}
          />
        </div>

        {/* Backdrop for mobile right sidebar */}
        {isRightSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 xl:hidden"
            onClick={() => setIsRightSidebarOpen(false)}
          />
        )}

        {/* Mobile Right Sidebar: Slide-over Drawer for Question Navigator */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-neutral-900 shadow-2xl xl:hidden flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
            isRightSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-neutral-100 dark:border-neutral-800">
            <span className="font-bold text-neutral-900 dark:text-white">
              Bản đồ câu hỏi
            </span>
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <QuestionNavigator
              questions={allQuestionsFlat}
              answers={answers}
              marks={marks}
              onNavigateToQuestion={(qId) => {
                handleNavigateToQuestion(qId);
                setIsRightSidebarOpen(false);
              }}
              onSave={() => {
                handleSaveAnswers(true);
                setIsRightSidebarOpen(false);
              }}
              onSubmit={() => {
                setIsSubmitDialogOpen(true);
                setIsRightSidebarOpen(false);
              }}
              saving={saving}
              submitting={submitting}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <SubmitConfirmDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={executeSubmit}
        answeredCount={answeredCount}
        markedCount={markedCount}
        unansweredCount={unansweredCount}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default ToeicTakingTest;
