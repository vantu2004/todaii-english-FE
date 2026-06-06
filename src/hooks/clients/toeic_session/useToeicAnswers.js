import { useState, useEffect, useRef } from "react";

export const useToeicAnswers = (initialAnswers) => {
  const [answers, setAnswers] = useState({});
  const answersRef = useRef(answers);

  useEffect(() => {
    if (initialAnswers) {
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

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

  return {
    answers,
    answersRef,
    handleAnswerSelect,
    handleToggleMark,
  };
};
