import { clientInstance } from "../../config/axios";

export const getAllTopics = async (topicType) => {
  try {
    const response = await clientInstance.get("/topic", {
      params: { topicType },
    });
    return response.data;
  } catch (err) {
    console.error("Get all topics error:", err);
    throw err;
  }
};
