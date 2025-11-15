import { serverInstance } from "../../config/axios";

export const fetchUsers = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/user", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchUser = async (userId) => {
  try {
    const response = await serverInstance.get(`/user/${userId}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateUser = async (userId, data) => {
  try {
    const response = await serverInstance.put(`/user/${userId}`, data);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const toggleUser = async (userId) => {
  try {
    await serverInstance.patch(`/user/${userId}/enabled`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteUser = async (userId) => {
  try {
    await serverInstance.delete(`/user/${userId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
