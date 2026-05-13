import { serverInstance } from "@/config/axios";

export const getQuestionById = async (questionId) => {
  try {
    const response = await serverInstance.get(`/toeic/question/${questionId}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getQuestionsByPartNumber = async (testId, partNumber) => {
  try {
    const response = await serverInstance.get(
      `/toeic/test/${testId}/part/${partNumber}/question`,
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    await serverInstance.delete(`/toeic/question/${questionId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createPart12Question = async (testId, partNumber, data) => {
  try {
    const response = await serverInstance.post(
      `/toeic/test/${testId}/part-12/${partNumber}/question`,
      data,
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updatePart12Question = async (questionId, data) => {
  try {
    const response = await serverInstance.put(
      `/toeic/part-12/question/${questionId}`,
      data,
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createPart34567Question = async (testId, partNumber, data) => {
  try {
    const response = await serverInstance.post(
      `/toeic/test/${testId}/part-34567/${partNumber}/question`,
      data,
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updatePart34567Question = async (questionId, data) => {
  try {
    const response = await serverInstance.put(
      `/toeic/part-34567/question/${questionId}`,
      data,
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
