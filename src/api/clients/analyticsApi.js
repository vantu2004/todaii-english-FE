import { clientInstance } from "@/config/axios";

export const getWeaknessAnalysis = async () => {
  try {
    const response = await clientInstance.get("/analytics/weakness");
    return response.data; // List of Part Weakness (part, total, correct, accuracy)
  } catch (err) {
    console.error("Get weakness analysis error:", err);
    throw err;
  }
};

export const getScorePrediction = async () => {
  try {
    const response = await clientInstance.get("/analytics/score-prediction");
    return response.data; // { avg_score, predicted_score, trend_bonus, total_tests_taken, trend }
  } catch (err) {
    console.error("Get score prediction error:", err);
    throw err;
  }
};
