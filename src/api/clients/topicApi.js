import { clientInstance } from "../../config/axios";

export const getAllTopics = async () => {
  try {
    const response = await clientInstance.get("/topic");
    return response.data;
  } catch (err) {
    console.error("Get all topics error:", err);
    throw err;
  }
};
