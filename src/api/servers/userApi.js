import { serverInstance } from "../../config/axios";

const fetchUsers = async () => {
  try {
    const response = await serverInstance.get("/user");
    return response.data.content;
  } catch (err) {
    console.error("Error:", err);
  }
};
