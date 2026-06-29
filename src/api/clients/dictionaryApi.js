import { clientInstance } from "@/config/axios";

export const searchByTodaiiDictionary = async (word, page, size) => {
  try {
    const response = await clientInstance.get("/dictionary/todaii-dict", {
      params: { word, page, size },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const searchByFreeDictionaryApi = async (word) => {
  try {
    const response = await clientInstance.get("/dictionary/free-dict", {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getAiSuggestion = async (word) => {
  try {
    const response = await clientInstance.get("/dictionary/ai-suggestion", {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getTopWords = async () => {
  try {
    const response = await clientInstance.get("/dictionary/top-words");
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
