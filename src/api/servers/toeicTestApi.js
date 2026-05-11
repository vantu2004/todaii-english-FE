import { serverInstance } from "@/config/axios";

export const fetchToeicTests = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/toeic/test", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const getToeicTestById = async (id) => {
  try {
    const response = await serverInstance.get(`/toeic/test/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createToeicTest = async (data) => {
  try {
    const response = await serverInstance.post("/toeic/test", data);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateToeicTest = async (id, data) => {
  try {
    const response = await serverInstance.put(`/toeic/test/${id}`, data);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteToeicTest = async (id) => {
  try {
    await serverInstance.delete(`/toeic/test/${id}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
