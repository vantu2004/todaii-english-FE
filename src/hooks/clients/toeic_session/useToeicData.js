import { useState, useEffect } from "react";
import { getTestById } from "@/api/clients/toeicTestApi";
import { getQuestionByPartNumber } from "@/api/clients/toeicQuestionApi";
import { getPassageByPartNumber } from "@/api/clients/toeicPassageApi";
import { getSessionDetails } from "@/api/clients/toeicSessionApi";
import toast from "react-hot-toast";
import { logError } from "@/utils/LogError";

const initAnswers = (sessionAnswers) => {
  if (!sessionAnswers || !Array.isArray(sessionAnswers)) return {};
  const parsed = {};

  sessionAnswers.forEach((ans) => {
    const qId = ans.question_id || ans.id;
    const opt = ans.user_choice || null;
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

  const standaloneQuestions = (questions || []).filter((q) => !q.passage_id);

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

export const useToeicData = (sessionId, navigate) => {
  const [session, setSession] = useState(null);
  const [test, setTest] = useState(null);
  const [selectedPartIds, setSelectedPartIds] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [partItems, setPartItems] = useState({});
  const [loading, setLoading] = useState(true);

  // States to pass down to other hooks
  const [initialAnswers, setInitialAnswers] = useState(null);
  const [initialTimeLeft, setInitialTimeLeft] = useState(null);

  useEffect(() => {
    const fetchSessionAndTestData = async () => {
      try {
        setLoading(true);

        if (!sessionId) {
          toast.error("Test session info not found!");
          navigate("/client/toeic");
          return;
        }

        const sessionData = await getSessionDetails(sessionId);

        if (sessionData.status === "COMPLETED") {
          localStorage.removeItem(`toeic_timeLeft_${sessionId}`);
          localStorage.removeItem(`toeic_lastTime_${sessionId}`);
          navigate(`/client/toeic/result/${sessionId}`, { replace: true });
          return;
        }
        setSession(sessionData);

        const partsDoneStr = sessionData.parts_done;
        let partIds = [1, 2, 3, 4, 5, 6, 7];
        if (partsDoneStr) {
          partIds = partsDoneStr
            .split(",")
            .map((s) => parseInt(s.trim()))
            .filter((id) => id >= 1 && id <= 7);
        }
        setSelectedPartIds(partIds);

        const answersList = sessionData.user_answers;
        if (answersList) {
          const loadedAnswers = initAnswers(answersList);
          setInitialAnswers(loadedAnswers);
        } else {
          setInitialAnswers({});
        }

        const timeSpentVal = sessionData.time_spent || 0;
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
            finalTimeLeft = Math.max(0, cachedTimeLeft - timeDiff);
          }
        }

        if (finalTimeLeft === null) {
          const stoppedAtVal = sessionData.stopped_at;
          const startedAtVal = sessionData.started_at;
          const endRef = stoppedAtVal
            ? new Date(stoppedAtVal).getTime()
            : Date.now();
          const startRef = new Date(startedAtVal).getTime();
          const elapsed = Math.max(0, Math.floor((endRef - startRef) / 1000));
          finalTimeLeft = Math.max(0, initialSeconds - elapsed);
        }

        setInitialTimeLeft(finalTimeLeft);

        const currentTestId = sessionData.test_id;
        const testInfo = await getTestById(currentTestId);
        setTest(testInfo);

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

  return {
    session,
    test,
    partItems,
    selectedPartIds,
    loading,
    initialAnswers,
    initialTimeLeft,
  };
};
