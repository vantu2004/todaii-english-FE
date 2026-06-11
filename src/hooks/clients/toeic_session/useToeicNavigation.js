import { useState, useEffect, useMemo, useRef } from "react";

export const useToeicNavigation = (selectedPartIds, partItems, answers) => {
  const [currentPart, setCurrentPart] = useState(1);
  const questionRefs = useRef({});

  useEffect(() => {
    if (selectedPartIds.length > 0 && !selectedPartIds.includes(currentPart)) {
      setCurrentPart(selectedPartIds[0]);
    }
  }, [selectedPartIds, currentPart]);

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

  const getQuestionNumber = (questionId) => {
    const q = allQuestionsFlat.find((x) => x.id === questionId);
    return q ? q.questionNumber : 1;
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

  return {
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
  };
};
