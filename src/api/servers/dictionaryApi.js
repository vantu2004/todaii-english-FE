import { serverInstance } from "@/config/axios";

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

export const getWordById = async (id) => {
  try {
    const response = await serverInstance.get(`/dictionary/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const searchInDb = async (word, page, size) => {
  try {
    const response = await serverInstance.get("/dictionary/search", {
      params: { word, page, size },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getAllWordsCursor = async (lastId, size) => {
  try {
    const response = await serverInstance.get("/dictionary/cursor", {
      params: { lastId, size },
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

export const createWord = async (word) => {
  try {
    const response = await serverInstance.post("/dictionary", null, {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateWord = async (id, word) => {
  try {
    const response = await serverInstance.put(`/dictionary/${id}`, null, {
      params: { word },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteWord = async (id) => {
  try {
    await serverInstance.delete(`/dictionary/${id}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchDictionary = async (
  page,
  size,
  sortBy,
  direction,
  keyword,
) => {};

export const createDictionaryEntryByGemini = async (word) => {};
