import { clientInstance } from "@/config/axios";

export const getSessionDetails = async (sessionId) => {
  try {
    const response = await clientInstance.get(`/toeic/session/${sessionId}`);
    return response.data;
  } catch (err) {
    console.error("Error getting session details:", err);
    throw err;
  }
};

export const getSessionHistory = async () => {
  try {
    const response = await clientInstance.get("/toeic/session/history");
    return response.data;
  } catch (err) {
    console.error("Error getting session history:", err);
    throw err;
  }
};

export const startSession = async ({ testId, mode, timeSpent, partsDone }) => {
  try {
    const response = await clientInstance.post("/toeic/session/start", {
      test_id: testId,
      mode,
      time_spent: timeSpent,
      parts_done: partsDone,
    });

    return response.data;
  } catch (err) {
    console.error("Error starting session:", err);
    throw err;
  }
};

export const saveAnswers = async (sessionId, requests) => {
  try {
    const response = await clientInstance.post(
      `/toeic/session/${sessionId}/answers`,
      { requests },
    );

    return response.data;
  } catch (err) {
    console.error("Error saving answers:", err);
    throw err;
  }
};

export const submitSession = async (sessionId, requests) => {
  try {
    const response = await clientInstance.post(
      `/toeic/session/${sessionId}/submit`,
      requests,
    );

    return response.data;
  } catch (err) {
    console.error("Error submitting session:", err);
    throw err;
  }
};
