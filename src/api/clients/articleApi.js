import { clientInstance } from "../../config/axios";

export const getLastestArticles = async (size) => {
  try {
    const response = await clientInstance.get(`article/latest?size=${size}`);
    return response.data;
  } catch (err) {
    console.error("Get latest articles error:", err);
    throw err;
  }
};


