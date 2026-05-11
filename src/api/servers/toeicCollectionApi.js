import { serverInstance } from "@/config/axios";

export const fetchToeicCollections = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = "",
) => {
  try {
    const response = await serverInstance.get("/toeic/collection", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getToeicCollectionById = async (id) => {
  try {
    const response = await serverInstance.get(`/toeic/collection/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createToeicCollection = async (data) => {
  try {
    const response = await serverInstance.post("/toeic/collection", data);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateToeicCollection = async (id, data) => {
  try {
    const response = await serverInstance.put(`/toeic/collection/${id}`, data);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteToeicCollection = async (id) => {
  try {
    await serverInstance.delete(`/toeic/collection/${id}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const toggleToeicCollectionEnabled = async (id) => {
  try {
    await serverInstance.patch(`/toeic/collection/${id}/enabled`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
