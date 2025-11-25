import { clientInstance } from "../../config/axios";

export const getRawWord = async (word) => {
  try {
    const response = await clientInstance.get("/dictionary/raw-word", {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Get raw word error:", err);
    throw err;
  }
};

export const getWordById = async (id) => {
  try {
    const response = await clientInstance.get(`/dictionary/${id}`);
    return response.data;
  } catch (err) {
    console.error("Get word by id error:", err);
    throw err;
  }
};

export const getWordByHeadword = async (word) => {
  try {
    const response = await clientInstance.get("/dictionary/headword", {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Get word by headword error:", err);
    throw err;
  }
};

export const getWordByGemini = async (word) => {
  try {
    const response = await clientInstance.get("/dictionary/gemini", {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Get word by gemini error:", err);
    throw err;
  }
};
