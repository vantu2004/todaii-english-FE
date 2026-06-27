import { clientInstance } from "@/config/axios";

export const getCurrentStudyPlan = async () => {
  try {
    const response = await clientInstance.get("/study-plan/current");
    // Returns 204 No Content (null/empty) or 200 OK with study plan object:
    // { id, content, created_at }
    if (response.status === 204) {
      return null;
    }
    return response.data;
  } catch (err) {
    console.error("Get current study plan error:", err);
    throw err;
  }
};

export const getStudyPlanHistory = async () => {
  try {
    const response = await clientInstance.get("/study-plan/history");
    return response.data; // List of study plans
  } catch (err) {
    console.error("Get study plan history error:", err);
    throw err;
  }
};
