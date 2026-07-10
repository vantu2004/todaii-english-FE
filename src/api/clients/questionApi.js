import { clientInstance } from "@/config/axios";

export const getQuestions = async (topicType, targetId) => {
  try {
    const response = await clientInstance.get("/questions", {
      params: { topicType, targetId },
    });
    return response.data;
  } catch (err) {
    console.error("Get questions error:", err);
    throw err;
  }
};
