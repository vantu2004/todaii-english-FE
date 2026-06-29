import { clientInstance } from "@/config/axios";

export const pingStudyTime = async () => {
  try {
    const response = await clientInstance.post("/study-logs/ping");
    return response.data;
  } catch (err) {
    console.error("Ping study time error:", err);
    throw err;
  }
};

export const incrementStudyItem = async (type) => {
  try {
    const response = await clientInstance.post("/study-logs/increment", null, {
      params: { type },
    });
    return response.data;
  } catch (err) {
    console.error(`Increment study item (${type}) error:`, err);
    throw err;
  }
};

export const getStreakInfo = async () => {
  try {
    const response = await clientInstance.get("/study-logs/streak-info");
    return response.data;
  } catch (err) {
    console.error("Get streak info error:", err);
    throw err;
  }
};
