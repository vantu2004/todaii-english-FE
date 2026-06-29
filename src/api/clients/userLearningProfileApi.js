import { clientInstance } from "@/config/axios";

export const getUserLearningProfile = async () => {
  try {
    const response = await clientInstance.get("/learning-profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user learning profile:", error);
    throw error;
  }
};

export const updateUserLearningProfile = async (request) => {
  try {
    const response = await clientInstance.put("/learning-profile", request);
    return response.data;
  } catch (error) {
    console.error("Error updating user learning profile:", error);
    throw error;
  }
};
