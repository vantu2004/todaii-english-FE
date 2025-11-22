import { clientInstance } from "../../config/axios";

export const fetchProfile = async () => {
  try {
    const response = await clientInstance.get("/user/me");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const toggleSavedArticle = async (articleId) => {
  try {
    const response = await clientInstance.put(`/user/article/${articleId}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
