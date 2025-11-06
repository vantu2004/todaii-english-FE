import { serverInstance } from "../../config/axios";

export const fetchProfile = async () => {
  try {
    const response = await serverInstance.get("/admin/me");
    return response.data;
  } catch (err) {
    console.error("Error:", err);
  }
};
