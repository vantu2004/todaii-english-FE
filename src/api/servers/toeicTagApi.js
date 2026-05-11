import { serverInstance } from "@/config/axios";

export const fetchAllToeicTags = async () => {
  try {
    const response = await serverInstance.get("/toeic/tag");
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getToeicTagById = async (id) => {
  try {
    const response = await serverInstance.get(`/toeic/tag/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createToeicTag = async (name) => {
  try {
    const response = await serverInstance.post("/toeic/tag", null, {
      params: { name }
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateToeicTag = async (id, name) => {
  try {
    const response = await serverInstance.put(`/toeic/tag/${id}`, null, {
      params: { name }
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteToeicTag = async (id) => {
  try {
    await serverInstance.delete(`/toeic/tag/${id}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
