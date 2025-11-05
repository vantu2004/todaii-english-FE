import { clientInstance } from "../../config/axios";

export const fetchProfile = async () => {
  try {
    const response = await clientInstance.get("/user/me");
    return response.data;
  } catch (err) {
    console.error("Error:", err);
  }
};
