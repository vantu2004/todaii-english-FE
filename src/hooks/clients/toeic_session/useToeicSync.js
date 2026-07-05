import { useState, useEffect, useRef } from "react";
import { saveAnswers, submitSession } from "@/api/clients/toeicSessionApi";
import toast from "react-hot-toast";
import { logError } from "@/utils/LogError";
import { incrementStudyItem } from "@/api/clients/studyLogApi";
import { STUDY_EVENTS, emitStudyEvent } from "@/utils/studyEvents";

const buildAnswerRequests = (allQuestionsFlat, currentAnswers) =>
  allQuestionsFlat.map((q) => ({
    question_id: q.id,
    user_choice: currentAnswers[q.id]?.user_choice ?? null,
    is_marked: currentAnswers[q.id]?.is_marked ?? false,
  }));

export const useToeicSync = ({
  sessionId,
  loading,
  answersRef,
  allQuestionsFlat,
  navigate,
  setIsSubmitDialogOpen,
}) => {
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const allQuestionsFlatRef = useRef(allQuestionsFlat);

  useEffect(() => {
    allQuestionsFlatRef.current = allQuestionsFlat;
  }, [allQuestionsFlat]);

  const executeSubmit = async () => {
    if (!sessionId) return;

    try {
      setSubmitting(true);
      const requests = buildAnswerRequests(
        allQuestionsFlatRef.current,
        answersRef.current,
      );

      await submitSession(sessionId, requests);

      // Increment test study item
      incrementStudyItem("TEST")
        .then(() => emitStudyEvent(STUDY_EVENTS.ITEM_INCREMENTED))
        .catch((err) =>
          console.error("Increment test study item error:", err),
        );

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

  const handleSaveAnswers = async (showToast = true) => {
    if (!sessionId) return;
    const requests = buildAnswerRequests(
      allQuestionsFlatRef.current,
      answersRef.current,
    );
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

  // Auto-Save progress every 2 minutes
  useEffect(() => {
    if (!sessionId || loading) return;
    const autoSaveInterval = setInterval(() => {
      const requests = buildAnswerRequests(
        allQuestionsFlatRef.current,
        answersRef.current,
      );
      if (requests.length > 0) {
        saveAnswers(sessionId, requests).catch((err) =>
          console.error("Auto-save failed", err),
        );
      }
    }, 120000);
    return () => clearInterval(autoSaveInterval);
  }, [sessionId, loading, answersRef]);

  // Save answers on visibilitychange (tab hidden) and beforeunload
  useEffect(() => {
    if (!sessionId || loading) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const requests = buildAnswerRequests(
          allQuestionsFlatRef.current,
          answersRef.current,
        );
        if (requests.length > 0) {
          saveAnswers(sessionId, requests).catch((err) =>
            console.error("Visibility change save failed", err),
          );
        }
      }
    };

    const handleBeforeUnload = (e) => {
      const requests = buildAnswerRequests(
        allQuestionsFlatRef.current,
        answersRef.current,
      );
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
  }, [sessionId, loading, answersRef]);

  // Save answers on component unmount
  useEffect(() => {
    return () => {
      const currentAnswers = answersRef.current;
      if (sessionId && Object.keys(currentAnswers).length > 0) {
        const requests = buildAnswerRequests(
          allQuestionsFlatRef.current,
          currentAnswers,
        );
        if (requests.length > 0) {
          saveAnswers(sessionId, requests).catch((err) =>
            console.error("Save on unmount failed", err),
          );
        }
      }
    };
  }, [sessionId, answersRef]);

  return {
    saving,
    submitting,
    handleSaveAnswers,
    executeSubmit,
  };
};
