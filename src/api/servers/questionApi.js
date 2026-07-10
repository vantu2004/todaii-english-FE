import { serverInstance } from "@/config/axios";

export const getQuestions = async (topicType, targetId) => {
  try {
    const response = await serverInstance.get("/questions", {
      params: { topicType, targetId },
    });
    return response.data;
  } catch (err) {
    console.error("Get questions error:", err);
    throw err;
  }
};

export const createQuestion = async (data) => {
  try {
    const response = await serverInstance.post("/questions", data);
    return response.data;
  } catch (err) {
    console.error("Create question error:", err);
    throw err;
  }
};

export const updateQuestion = async (id, data) => {
  try {
    const response = await serverInstance.put(`/questions/${id}`, data);
    return response.data;
  } catch (err) {
    console.error("Update question error:", err);
    throw err;
  }
};

export const deleteQuestion = async (id) => {
  try {
    await serverInstance.delete(`/questions/${id}`);
  } catch (err) {
    console.error("Delete question error:", err);
    throw err;
  }
};

export const autoGenerateQuestions = async (topicType, targetId, count) => {
  try {
    const response = await serverInstance.post(
      "/questions/auto-generate",
      null,
      {
        params: { topicType, targetId, count },
      },
    );
    return response.data;
  } catch (err) {
    console.error("Auto generate questions error:", err);
    throw err;
  }
};
