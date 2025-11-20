import { serverInstance } from "../../config/axios";

export const fetchProfile = async () => {
  try {
    const response = await serverInstance.get("/admin/me");
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await serverInstance.put("/admin/me", data);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchAdmins = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/admin", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createAdmin = async (data) => {
  try {
    await serverInstance.post("/admin", {
      email: data.email,
      password: data.password,
      display_name: data.displayName,
      role_codes: data.roleCodes,
    });
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateAdmin = async (adminId, data) => {
  try {
    await serverInstance.put(`/admin/${adminId}`, {
      email: data.email,
      password: data.password,
      display_name: data.displayName,
      role_codes: data.roleCodes,
    });
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const toggleAdmin = async (adminId) => {
  try {
    await serverInstance.patch(`/admin/${adminId}/enabled`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    await serverInstance.delete(`/admin/${adminId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
