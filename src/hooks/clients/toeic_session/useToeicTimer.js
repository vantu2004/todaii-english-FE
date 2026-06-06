import { useState, useEffect, useRef } from "react";

export const useToeicTimer = (
  sessionId,
  loading,
  initialTimeLeft,
  handleAutoSubmit,
) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const handleAutoSubmitRef = useRef(handleAutoSubmit);

  useEffect(() => {
    handleAutoSubmitRef.current = handleAutoSubmit;
  }, [handleAutoSubmit]);

  useEffect(() => {
    if (initialTimeLeft !== null) {
      setTimeLeft(initialTimeLeft);
      localStorage.setItem(
        `toeic_timeLeft_${sessionId}`,
        initialTimeLeft.toString(),
      );
      localStorage.setItem(
        `toeic_lastTime_${sessionId}`,
        Date.now().toString(),
      );
    }
  }, [initialTimeLeft, sessionId]);

  useEffect(() => {
    if (loading || timeLeft === null) return;

    if (timeLeft <= 0) {
      handleAutoSubmitRef.current();
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
          handleAutoSubmitRef.current();
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(timer);
    // We intentionally leave out `timeLeft` so the interval is set once and ticks correctly using functional state updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, sessionId]);

  return timeLeft;
};
