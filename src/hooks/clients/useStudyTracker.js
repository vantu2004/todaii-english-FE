import { useEffect, useRef } from "react";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import { pingStudyTime } from "@/api/clients/studyLogApi";
import { logError } from "@/utils/LogError";

export function useStudyTracker() {
  const { isLoggedIn } = useClientAuthContext();
  const isActivityDetected = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Ping once immediately on mount
    pingStudyTime().catch(logError);

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
  }, [isLoggedIn]);
}
