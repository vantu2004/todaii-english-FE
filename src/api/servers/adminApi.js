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
  sortBy = "updatedAt",
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

export const toggleAdmin = async (adminId) => {
  try {
    const response = await serverInstance.patch(`/admin/${adminId}/enabled`);
    return response.data; 
  } catch (err) {
    console.error(`Error toggling enabled state for admin ${adminId}:`, err);
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    const response = await serverInstance.delete(`/admin/${adminId}`);
    return response.data; 
  } catch (err) {
    console.error(`Error deleting admin ${adminId}:`, err);
  }
};
