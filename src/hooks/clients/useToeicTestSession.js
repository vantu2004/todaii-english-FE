import { useState, useMemo, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { useToeicData } from "./toeic_session/useToeicData";
import { useToeicAnswers } from "./toeic_session/useToeicAnswers";
import { useToeicTimer } from "./toeic_session/useToeicTimer";
import { useToeicNavigation } from "./toeic_session/useToeicNavigation";
import { useToeicSync } from "./toeic_session/useToeicSync";

export const useToeicTestSession = (sessionId, navigate) => {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const audioRef = useRef(null);

  const {
    session,
    test,
    partItems,
    selectedPartIds,
    loading,
    initialAnswers,
    initialTimeLeft,
  } = useToeicData(sessionId, navigate);

  const { answers, answersRef, handleAnswerSelect, handleToggleMark } =
    useToeicAnswers(initialAnswers);

  const {
    currentPart,
    setCurrentPart,
    questionRefs,
    allQuestionsFlat,
    getQuestionNumber,
    handleNavigateToQuestion,
    answeredCount,
    markedCount,
    unansweredCount,
    hasPreviousPart,
    hasNextPart,
    currentPartIndex,
    handlePreviousPart,
    handleNextPart,
  } = useToeicNavigation(selectedPartIds, partItems, answers);

  const { saving, submitting, handleSaveAnswers, executeSubmit } = useToeicSync(
    {
      sessionId,
      loading,
      answersRef,
      allQuestionsFlat,
      navigate,
      setIsSubmitDialogOpen,
    },
  );

  const handleAutoSubmit = async () => {
    toast.error("Time is up!", { id: "timeout-toast" });
    await executeSubmit();
  };

  const timeLeft = useToeicTimer(
    sessionId,
    loading,
    initialTimeLeft,
    handleAutoSubmit,
  );

  const isFirstTime = useMemo(() => {
    if (!session) return true;
    const answersList = session.user_answers || [];
    const timeSpentVal = session.time_spent || 0;
    return timeSpentVal === 0 && answersList.length === 0;
  }, [session]);

  // Autoplay full test audio on mount / first interaction
  useEffect(() => {
    if (session?.mode === "FULL_TEST" && test && isFirstTime) {
      const audioUrl = test.audio_url;
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
  }, [session, test, isFirstTime]);

  return {
    session,
    test,
    loading,
    selectedPartIds,
    currentPart,
    partItems,
    answers,
    timeLeft,
    isFirstTime,
    saving,
    submitting,
    allQuestionsFlat,
    answeredCount,
    markedCount,
    unansweredCount,
    hasPreviousPart,
    hasNextPart,
    currentPartIndex,
    isRightSidebarOpen,
    setIsRightSidebarOpen,
    isSubmitDialogOpen,
    setIsSubmitDialogOpen,
    audioRef,
    questionRefs,
    getQuestionNumber,
    handleAnswerSelect,
    handleToggleMark,
    handleSaveAnswers,
    handleNavigateToQuestion,
    handlePreviousPart,
    handleNextPart,
    executeSubmit,
  };
};
