import { useEffect, useRef } from "react";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import { pingStudyTime } from "@/api/clients/studyLogApi";
import { logError } from "@/utils/LogError";
import { STUDY_EVENTS, emitStudyEvent } from "@/utils/studyEvents";

export function useStudyTracker(isStudying = false) {
  const { isLoggedIn } = useClientAuthContext();
  const isActivityDetected = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !isStudying) return;

    // Track user activity events
    const handleActivity = () => {
      isActivityDetected.current = true;
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    // Ping every 5 minutes if activity is detected
    const intervalId = setInterval(
      () => {
        if (isActivityDetected.current) {
          pingStudyTime()
            .then(() => {
              isActivityDetected.current = false; // Reset activity detection for next interval
              emitStudyEvent(STUDY_EVENTS.PING_SUCCESS);
            })
            .catch(logError);
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
      clearInterval(intervalId);
    };
  }, [isLoggedIn, isStudying]);
}
