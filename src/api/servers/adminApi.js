import { serverInstance } from "../../config/axios";

export const fetchProfile = async () => {
  try {
    const response = await serverInstance.get("/admin/me");
    return response.data;
  } catch (err) {
    console.error("Error:", err);
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
    console.error("Error fetching admins:", err);
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
    console.error("Error creating admin:", err);
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
    console.error(`Error updating admin ${adminId}:`, err);
    throw err;
  }
};

export const toggleAdmin = async (adminId) => {
  try {
    await serverInstance.patch(`/admin/${adminId}/enabled`);
  } catch (err) {
    console.error(`Error toggling enabled state for admin ${adminId}:`, err);
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    await serverInstance.delete(`/admin/${adminId}`);
  } catch (err) {
    console.error(`Error deleting admin ${adminId}:`, err);
  }
};
