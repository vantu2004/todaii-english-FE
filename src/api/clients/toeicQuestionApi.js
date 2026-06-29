import { clientInstance } from "@/config/axios";

export const getQuestionById = async (questionId) => {
  try {
    const response = await clientInstance.get(`/toeic/question/${questionId}`);
    return response.data;
  } catch (err) {
    console.log("Error to get question by id:", err);
    throw err;
  }
};

export const getQuestionByPartNumber = async (testId, partNumber) => {
  try {
    const response = await clientInstance.get(
      `/toeic/test/${testId}/part/${partNumber}/question`,
    );
    return response.data;
  } catch (err) {
    console.log("Error to get question by part number:", err);
    throw err;
  }
};
