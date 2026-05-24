import { serverInstance } from "@/config/axios";

export const searchByFreeDictionaryApi = async (word) => {
  try {
    const response = await serverInstance.get("/dictionary/free-dict", {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const searchByTodaiiDictionary = async (word, page, size) => {
  try {
    const response = await serverInstance.get("/dictionary/todaii-dict", {
      params: { word, page, size },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getAiSuggestion = async (word) => {
  try {
    const response = await serverInstance.get("/dictionary/ai-suggestion", {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchRawWord = async (word) => {
  try {
    const response = await serverInstance.get("/dictionary/raw-word", {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchDictionary = async (
  page = 1,
  size = 20,
  sortBy = "headword",
  direction = "asc",
  keyword = "",
) => {
  try {
    const response = await serverInstance.get("/dictionary", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createDictionaryEntry = async (data) => {
  try {
    await serverInstance.post("/dictionary", data);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createDictionaryEntryByGemini = async (data) => {
  try {
    const response = await serverInstance.post("/dictionary/gemini", null, {
      params: { word: data },
    });

    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateDictionaryEntry = async (id, data) => {
  try {
    await serverInstance.put(`/dictionary/${id}`, data);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteDictionaryEntry = async (id) => {
  try {
    await serverInstance.delete(`/dictionary/${id}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
