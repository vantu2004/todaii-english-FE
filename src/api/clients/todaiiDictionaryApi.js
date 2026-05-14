import { clientInstance } from "@/config/axios";

export const getWordByTodaiiApi = async (word, page, size) => {
  try {
    const response = await clientInstance.get("/todaii-dictionary", {
      params: { word, page, size },
    });
    return response.data;
  } catch (err) {
    console.error("Get word error:", err);
    throw err;
  }
};
