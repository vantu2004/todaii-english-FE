import { clientInstance } from "@/config/axios";

export const findAllTagsByTestId = async (testId) => {
  try {
    const response = await clientInstance.get(`/toeic/test/${testId}/tag`);
    return response.data;
  } catch (err) {
    console.log("Error to get all tags by test id:", err);
    throw err;
  }
};

export const findQuestionsByTag = async (testId, tagId) => {
  try {
    const response = await clientInstance.get(
      `/toeic/test/${testId}/tag/${tagId}/question`,
    );
    return response.data;
  } catch (err) {
    console.log("Error to get all questions by tag id:", err);
    throw err;
  }
};
