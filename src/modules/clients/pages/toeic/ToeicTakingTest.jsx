import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import QuestionItem from "@/components/clients/toeic_page/taking_test/QuestionItem";
import PassageGroup from "@/components/clients/toeic_page/taking_test/PassageGroup";
import QuestionNavigator from "@/components/clients/toeic_page/taking_test/QuestionNavigator";
import SubmitConfirmDialog from "@/components/clients/toeic_page/taking_test/SubmitConfirmDialog";
import { logError } from "@/utils/LogError";

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

const ToeicTakingTest = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [selectedPartIds, setSelectedPartIds] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [test, setTest] = useState(null);
  const [partItems, setPartItems] = useState({}); // partId -> Item[]
  const [loading, setLoading] = useState(true);

  const [currentPart, setCurrentPart] = useState(1);
  const [answers, setAnswers] = useState({}); // questionId -> { user_choice, is_marked }
  const [timeLeft, setTimeLeft] = useState(null);

  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const questionRefs = useRef({});
  const audioRef = useRef(null);
  const answersRef = useRef(answers);
  const allQuestionsFlatRef = useRef([]);

  // Sync answersRef with answers state for handlers
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const initAnswers = (sessionAnswers) => {
    if (!sessionAnswers || !Array.isArray(sessionAnswers)) return {};
    const parsed = {};

    sessionAnswers.forEach((ans) => {
      const qId = ans.question_id || ans.questionId || ans.id;
      const opt =
        ans.user_choice || ans.selected_option || ans.selectedOption || null;
      parsed[qId] = {
        user_choice: opt,
        is_marked: ans.is_marked ?? false,
      };
    });

    return parsed;
  };

  const loadPart = async (testId, partNumber) => {
    const [questions, passages] = await Promise.all([
      getQuestionByPartNumber(testId, partNumber).catch(() => []),
      getPassageByPartNumber(testId, partNumber).catch(() => []),
    ]);

    // LỌC: chỉ lấy câu có passageId == null (câu độc lập)
    const standaloneQuestions = (questions || []).filter((q) => !q.passage_id);

    // MERGE standalone + passages → sort theo createdAt
    const items = [
      ...standaloneQuestions.map((q) => ({
        type: "question",
        data: q,
        createdAt: q.created_at,
      })),
      ...(passages || []).map((p) => ({
        type: "passage",
        data: p,
        createdAt: p.created_at,
      })),
    ];

    return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  // Fetch session details and related test data on mount
  useEffect(() => {
    const fetchSessionAndTestData = async () => {
      try {
        setLoading(true);

        if (!sessionId) {
          toast.error("Test session info not found!");
          navigate("/client/toeic");
          return;
        }

        // 1. Fetch Session Details
        const sessionData = await getSessionDetails(sessionId);

        if (sessionData.status === "COMPLETED") {
          localStorage.removeItem(`toeic_timeLeft_${sessionId}`);
          localStorage.removeItem(`toeic_lastTime_${sessionId}`);
          navigate(`/client/toeic/result/${sessionId}`, { replace: true });
          return;
        }
        setSession(sessionData);

        // Parse parts_done from session (e.g. "1,2,3")
        const partsDoneStr = sessionData.parts_done || sessionData.partsDone;
        let partIds = [1, 2, 3, 4, 5, 6, 7];
        if (partsDoneStr) {
          partIds = partsDoneStr
            .split(",")
            .map((s) => parseInt(s.trim()))
            .filter((id) => id >= 1 && id <= 7);
        }
        setSelectedPartIds(partIds);

        // Determine initial current part
        if (partIds.length > 0) {
          setCurrentPart(partIds[0]);
        }

        // Pre-fill answers from session
        const answersList =
          sessionData.userAnswers ||
          sessionData.user_answers ||
          sessionData.answers;
        if (answersList) {
          const loadedAnswers = initAnswers(answersList);
          setAnswers(loadedAnswers);
        }

        // Setup initial time left using localStorage cache if valid (reload check)
        const timeSpentVal =
          sessionData.time_spent || sessionData.timeSpent || 0;
        const initialSeconds = timeSpentVal * 60;

        const cachedTimeLeftStr = localStorage.getItem(
          `toeic_timeLeft_${sessionId}`,
        );
        const cachedLastTimeStr = localStorage.getItem(
          `toeic_lastTime_${sessionId}`,
        );
        let finalTimeLeft = null;

        if (cachedTimeLeftStr && cachedLastTimeStr) {
          const cachedTimeLeft = parseInt(cachedTimeLeftStr, 10);
          const cachedLastTime = parseInt(cachedLastTimeStr, 10);
          const timeDiff = Math.max(
            0,
            Math.floor((Date.now() - cachedLastTime) / 1000),
          );

          if (timeDiff < 60) {
            // Under 60s gap -> it's a page reload or brief blur
            finalTimeLeft = Math.max(0, cachedTimeLeft - timeDiff);
          }
        }

        if (finalTimeLeft === null) {
          // Bypassed or expired -> read from DB
          const stoppedAtVal = sessionData.stopped_at || sessionData.stoppedAt;
          const startedAtVal = sessionData.started_at || sessionData.startedAt;
          const endRef = stoppedAtVal
            ? new Date(stoppedAtVal).getTime()
            : Date.now();
          const startRef = new Date(startedAtVal).getTime();
          const elapsed = Math.max(0, Math.floor((endRef - startRef) / 1000));
          finalTimeLeft = Math.max(0, initialSeconds - elapsed);
        }

        setTimeLeft(finalTimeLeft);
        localStorage.setItem(
          `toeic_timeLeft_${sessionId}`,
          finalTimeLeft.toString(),
        );
        localStorage.setItem(
          `toeic_lastTime_${sessionId}`,
          Date.now().toString(),
        );

        // 2. Fetch Test Info
        const currentTestId = sessionData.test_id || sessionData.testId;
        const testInfo = await getTestById(currentTestId);
        setTest(testInfo);

        // 3. Fetch Questions and Passages concurrently
        const allPartItems = {};
        await Promise.all(
          partIds.map(async (partId) => {
            const items = await loadPart(currentTestId, partId);
            allPartItems[partId] = items;
          }),
        );
        setPartItems(allPartItems);
      } catch (err) {
        logError(err);
        navigate("/client/toeic");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndTestData();
  }, [sessionId, navigate]);

  // Timer Tickdown & Auto Submit
  useEffect(() => {
    if (loading || timeLeft === null) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const nextVal = prev > 1 ? prev - 1 : 0;
        localStorage.setItem(`toeic_timeLeft_${sessionId}`, nextVal.toString());
        localStorage.setItem(
          `toeic_lastTime_${sessionId}`,
          Date.now().toString(),
        );
        if (nextVal === 0) {
          clearInterval(timer);
          handleAutoSubmit();
        }
        return nextVal;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, sessionId]);

  // Autoplay full test audio on mount / first interaction
  useEffect(() => {
    if (session?.mode === "FULL_TEST" && test) {
      const audioUrl = test.audio_url || test.audioUrl;
      if (audioUrl && audioRef.current) {
        const playAudio = () => {
          audioRef.current.play().catch((err) => {
            console.log(
              "Autoplay prevented, will try on first interaction:",
              err,
            );
            const startOnInteraction = () => {
              audioRef.current?.play().catch(() => {});
              document.removeEventListener("click", startOnInteraction);
            };
            document.addEventListener("click", startOnInteraction);
          });
        };
        setTimeout(playAudio, 500);
      }
    }
  }, [session, test]);

  const buildAnswerRequests = (currentAnswers) =>
    allQuestionsFlatRef.current.map((q) => ({
      question_id: q.id,
      user_choice: currentAnswers[q.id]?.user_choice ?? null,
      is_marked: currentAnswers[q.id]?.is_marked ?? false,
    }));

  // Auto-Save progress every 2 minutes
  useEffect(() => {
    if (!sessionId || loading) return;
    const autoSaveInterval = setInterval(() => {
      const currentAnswers = answersRef.current;
      const requests = buildAnswerRequests(currentAnswers);
      if (requests.length > 0) {
        saveAnswers(sessionId, requests).catch((err) =>
          console.error("Auto-save failed", err),
        );
      }
    }, 120000);
    return () => clearInterval(autoSaveInterval);
  }, [sessionId, loading]);

  // Save answers on visibilitychange (tab hidden) and beforeunload
  useEffect(() => {
    if (!sessionId || loading) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const currentAnswers = answersRef.current;
        const requests = buildAnswerRequests(currentAnswers);
        if (requests.length > 0) {
          saveAnswers(sessionId, requests).catch((err) =>
            console.error("Visibility change save failed", err),
          );
        }
      }
    };

    const handleBeforeUnload = (e) => {
      const currentAnswers = answersRef.current;
      const requests = buildAnswerRequests(currentAnswers);
      if (requests.length > 0) {
        saveAnswers(sessionId, requests).catch((err) =>
          console.error("Before unload save failed", err),
        );
      }
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your progress will be saved.";
      return e.returnValue;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionId, loading]);

  // Save answers on component unmount
  useEffect(() => {
    return () => {
      const currentAnswers = answersRef.current;
      if (sessionId && Object.keys(currentAnswers).length > 0) {
        const requests = buildAnswerRequests(currentAnswers);
        if (requests.length > 0) {
          saveAnswers(sessionId, requests).catch((err) =>
            console.error("Save on unmount failed", err),
          );
        }
      }
    };
  }, [sessionId]);

  // Question Flattening & Numbering
  const allQuestionsFlat = useMemo(() => {
    const flat = [];
    let questionIndex = 0;

    selectedPartIds.forEach((partId) => {
      const items = partItems[partId] || [];
      items.forEach((item) => {
        if (item.type === "question") {
          questionIndex++;
          flat.push({
            id: item.data.id,
            partNumber: partId,
            questionNumber: questionIndex,
          });
        } else {
          // passage -> questions inside
          (item.data.questions || []).forEach((q) => {
            questionIndex++;
            flat.push({
              id: q.id,
              partNumber: partId,
              questionNumber: questionIndex,
            });
          });
        }
      });
    });
    return flat;
  }, [partItems, selectedPartIds]);

  useEffect(() => {
    allQuestionsFlatRef.current = allQuestionsFlat;
  }, [allQuestionsFlat]);

  const getQuestionNumber = (questionId) => {
    const q = allQuestionsFlat.find((x) => x.id === questionId);
    return q ? q.questionNumber : 1;
  };

  const handleAnswerSelect = (questionId, choice) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        user_choice: choice,
      },
    }));
  };

  const handleToggleMark = (questionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        is_marked: !prev[questionId]?.is_marked,
      },
    }));
  };

  const handleSaveAnswers = async (showToast = true) => {
    if (!sessionId) return;
    const requests = buildAnswerRequests(answersRef.current);
    if (requests.length === 0) return;

    try {
      setSaving(true);
      await saveAnswers(sessionId, requests);
      if (showToast) {
        toast.success("Progress saved successfully!");
      }
    } catch (err) {
      logError(err);
      if (showToast) {
        toast.error("Failed to save progress. Please check your connection.");
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
    toast.error("Time is up!", {
      id: "timeout-toast",
    });
    await executeSubmit();
  };

  const executeSubmit = async () => {
    if (!sessionId) return;

    try {
      setSubmitting(true);
      const requests = buildAnswerRequests(answers);

      await submitSession(sessionId, requests);

      // Clear timer cache
      localStorage.removeItem(`toeic_timeLeft_${sessionId}`);
      localStorage.removeItem(`toeic_lastTime_${sessionId}`);

      setIsSubmitDialogOpen(false);
      toast.success("Test submitted successfully!");
      navigate(`/client/toeic/result/${sessionId}`, { replace: true });
    } catch (err) {
      logError(err);
      toast.error("Submission failed. Please try again!");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "00:00:00";
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const answeredCount = useMemo(() => {
    return allQuestionsFlat.filter((q) => answers[q.id]?.user_choice).length;
  }, [allQuestionsFlat, answers]);

  const markedCount = useMemo(() => {
    return allQuestionsFlat.filter((q) => answers[q.id]?.is_marked).length;
  }, [allQuestionsFlat, answers]);

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
    const items = partItems[currentPart] || [];

    if (items.length === 0) {
      return (
        <div className="text-center py-12 text-neutral-500">
          Không có dữ liệu cho phần này.
        </div>
      );
    }

    return items.map((item) => {
      if (item.type === "question") {
        const questionNumber = getQuestionNumber(item.data.id);
        return (
          <QuestionItem
            key={item.data.id}
            ref={(el) => {
              questionRefs.current[item.data.id] = el;
            }}
            question={item.data}
            questionNumber={questionNumber}
            selectedAnswer={answers[item.data.id]?.user_choice || null}
            isMarked={answers[item.data.id]?.is_marked || false}
            onSelectAnswer={handleAnswerSelect}
            onToggleMark={handleToggleMark}
            optionCount={currentPart === 2 ? 3 : 4}
            mode={session?.mode}
            partNumber={currentPart}
          />
        );
      } else {
        // passage
        const passageQuestions = item.data.questions || [];
        const startNumber =
          passageQuestions.length > 0
            ? getQuestionNumber(passageQuestions[0].id)
            : 1;
        return (
          <PassageGroup
            key={item.data.id}
            passage={item.data}
            questions={passageQuestions}
            startNumber={startNumber}
            answers={answers}
            onSelectAnswer={handleAnswerSelect}
            onToggleMark={handleToggleMark}
            optionCount={4}
            questionRefs={questionRefs}
            partNumber={currentPart}
            mode={session?.mode}
          />
        );
      }
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
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-1.5 px-3 sm:px-4 flex items-center justify-between sticky top-[68px] z-45">
        <div className="flex items-center gap-3">
          <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate max-w-[150px] md:max-w-md">
            {test?.title}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Global test audio for FULL TEST mode */}
          {session?.mode === "FULL_TEST" &&
            (test?.audio_url || test?.audioUrl) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 rounded-md text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
                </span>
                <span>Audio bài thi đang phát</span>
                <audio
                  ref={audioRef}
                  src={test.audio_url || test.audioUrl}
                  autoPlay
                />
              </div>
            )}

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-medium">
            <CheckCircle2 size={12} className="text-brand-500" />
            <span className="text-neutral-700 dark:text-neutral-300">
              {answeredCount} / {allQuestionsFlat.length} đã làm
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-sm ${
              timeLeft !== null && timeLeft < 300
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-pulse"
                : "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
            }`}
          >
            <Clock size={14} />
            <span className="w-14 text-center tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>

          <button
            onClick={() => setIsSubmitDialogOpen(true)}
            className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-md text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            Nộp bài
          </button>

          <button
            type="button"
            className="xl:hidden p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            title="Bản đồ câu hỏi"
          >
            <Map size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-surface-primary dark:bg-neutral-950 p-2 sm:p-3 lg:p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-3 pb-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                {PARTS.find((p) => p.id === currentPart)?.name}
              </h2>
            </div>

            <div className="pb-12">{renderPartContent()}</div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 xl:right-80 p-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10">
              <button
                type="button"
                disabled={!hasPreviousPart}
                onClick={handlePreviousPart}
                className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
                <span>Phần trước</span>
              </button>

              <div className="text-xs font-semibold text-neutral-500">
                Phần {currentPartIndex + 1} / {selectedPartIds.length}
              </div>

              <button
                type="button"
                disabled={!hasNextPart}
                onClick={handleNextPart}
                className="flex items-center gap-1 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Phần tiếp</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Question Navigator for Desktop */}
        <div className="hidden xl:block w-80 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col h-full">
          <QuestionNavigator
            questions={allQuestionsFlat}
            answers={answers}
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
