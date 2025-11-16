import { serverInstance } from "../../config/axios";

export const saveParagraph = async (articleId, paragraph) => {
  try {
    const response = await serverInstance.post(
      `/article/${articleId}/paragraph`,
      paragraph
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const translateByGemini = async (textEn) => {
  try {
    const response = await serverInstance.post("/article/paragraph/translate", {
      textEn,
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteParagraph = async (paragraphId) => {
  try {
    await serverInstance.delete(`/article/paragraph/${paragraphId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
