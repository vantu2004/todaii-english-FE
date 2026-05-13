import { serverInstance } from "@/config/axios";

export const getPassagesByPartNumber = async (testId, partNumber) => {
  try {
    const response = await serverInstance.get(
      `/toeic/test/${testId}/part/${partNumber}/passage`,
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getPassageById = async (passageId) => {
  try {
    const response = await serverInstance.get(`/toeic/passage/${passageId}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createPassage = async (testId, partNumber, data) => {
  try {
    const response = await serverInstance.post(
      `/toeic/test/${testId}/part/${partNumber}/passage`,
      data,
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updatePassage = async (passageId, data) => {
  try {
    const response = await serverInstance.put(
      `/toeic/passage/${passageId}`,
      data,
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deletePassage = async (passageId) => {
  try {
    await serverInstance.delete(`/toeic/passage/${passageId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
