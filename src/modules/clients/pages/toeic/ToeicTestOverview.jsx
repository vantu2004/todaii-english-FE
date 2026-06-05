import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTestById } from "@/api/clients/toeicTestApi";
import { getSessionHistory, startSession } from "@/api/clients/toeicSessionApi";
import { findAllTagsByTestId } from "@/api/clients/toeicTagApi";
import { ArrowLeft, BookOpen, Clock, Award } from "lucide-react";
import toast from "react-hot-toast";

// Sub-components
import TestInfoTab from "@/components/clients/toeic_page/overview/TestInfoTab";
import PracticeTab from "@/components/clients/toeic_page/overview/PracticeTab";
import FullTestTab from "@/components/clients/toeic_page/overview/FullTestTab";
import TestDetailSidebar from "@/components/clients/toeic_page/overview/TestDetailSidebar";
import { logError } from "@/utils/LogError";

const ToeicTestOverview = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  // Core test details
  const [test, setTest] = useState(null);
  const [loadingTest, setLoadingTest] = useState(true);

  // Tabs navigation
  const [activeTab, setActiveTab] = useState("info"); // "info" | "practice" | "fulltest"

  // User session history
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Tags
  const [tags, setTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Practice state
  const [selectedParts, setSelectedParts] = useState([1, 2, 3, 4, 5, 6, 7]);

  // Session start
  const [startingSession, setStartingSession] = useState(false);

  const handleStartSession = async ({ mode, parts, duration }) => {
    try {
      setStartingSession(true);

      const session = await startSession({
        testId: Number(testId),
        mode,
        timeSpent: duration,
        partsDone: parts.join(","),
      });

      navigate(`/client/toeic/${testId}/take?sessionId=${session.id}`);
    } catch (err) {
      logError(err);
    } finally {
      setStartingSession(false);
    }
  };

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoadingTest(true);

        const data = await getTestById(testId);

        setTest(data);
      } catch (err) {
        logError(err);

        navigate("/client/toeic");
      } finally {
        setLoadingTest(false);
      }
    };

    fetchTestDetails();
  }, [testId, navigate]);

  useEffect(() => {
    const fetchSessionHistory = async () => {
      try {
        setLoadingSessions(true);

        const allSessions = await getSessionHistory();

        // Filter sessions by test_id (returned as snake_case)
        const testSessions = (allSessions || []).filter(
          (s) => Number(s.test_id) === Number(testId),
        );

        // Sort sessions by started_at DESC
        const sortedSessions = testSessions.sort(
          (a, b) => new Date(b.started_at) - new Date(a.started_at),
        );

        setSessions(sortedSessions);
      } catch (err) {
        logError(err);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessionHistory();
  }, [testId]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoadingTags(true);

        const testTags = await findAllTagsByTestId(testId);

        setTags(testTags || []);
      } catch (err) {
        logError(err);
      } finally {
        setLoadingTags(false);
      }
    };

    fetchTags();
  }, [testId]);

  const handleTogglePart = (partId) => {
    setSelectedParts((prev) => {
      if (prev.includes(partId)) {
        return prev.filter((id) => id !== partId);
      } else {
        return [...prev, partId].sort((a, b) => a - b);
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedParts([1, 2, 3, 4, 5, 6, 7]);
  };

  const handleDeselectAll = () => {
    setSelectedParts([]);
  };

  if (loadingTest) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mt-[68px] bg-surface-primary dark:bg-neutral-950">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!test) return null;

  return (
    <div className="w-full min-h-screen bg-surface-primary dark:bg-neutral-950 pt-[68px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Link */}
        <Link
          to="/client/toeic"
          className="inline-flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          <span>Quay lại danh sách</span>
        </Link>

        {/* Test Header Block */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-3">
              {test.collection?.name && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/30 dark:border-neutral-700/50">
                  {test.collection.name}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-tight">
                {test.title}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-neutral-500 dark:text-neutral-400 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-neutral-400" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {test.duration || 120} phút
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-neutral-400" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    7 phần thi
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={16} className="text-neutral-400" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    200 câu hỏi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full space-y-8">
          {/* Stats & Latest Attempt */}
          <TestDetailSidebar sessions={sessions} loading={loadingSessions} />

          {/* Test Action Tabs */}
          <div className="space-y-6">
            {/* Tab Switched Header */}
            <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl max-w-md">
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "info"
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                Thông tin đề
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("practice")}
                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "practice"
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                Luyện tập
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fulltest")}
                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === "fulltest"
                    ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                Làm full test
              </button>
            </div>

            {/* Tab Rendering */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
              {activeTab === "info" && (
                <TestInfoTab
                  test={test}
                  sessions={sessions}
                  loadingSessions={loadingSessions}
                />
              )}
              {activeTab === "practice" && (
                <PracticeTab
                  testId={testId}
                  tags={tags}
                  loadingTags={loadingTags}
                  selectedParts={selectedParts}
                  onTogglePart={handleTogglePart}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                  onStartSession={handleStartSession}
                  startingSession={startingSession}
                />
              )}
              {activeTab === "fulltest" && (
                <FullTestTab
                  testId={testId}
                  duration={test.duration || 120}
                  onStartSession={handleStartSession}
                  startingSession={startingSession}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeicTestOverview;
