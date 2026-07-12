import { clientInstance } from "@/config/axios";

export const getProgress = async (contentId, type) => {
  try {
    const response = await clientInstance.get(`/progress/${contentId}`, {
      params: { type },
    });
    return response.data;
  } catch (err) {
    console.error("Get progress error:", err);
    throw err;
  }
};

export const upsertProgress = async (contentId, payload) => {
  try {
    const response = await clientInstance.put(
      `/progress/${contentId}`,
      payload,
    );
    return response.data;
  } catch (err) {
    console.error("Upsert progress error:", err);
    throw err;
  }
};
