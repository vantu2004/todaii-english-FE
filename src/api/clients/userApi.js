import { clientInstance } from "../../config/axios";

export const fetchProfile = async () => {
  try {
    const response = await clientInstance.get("/user/me");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getSavedArticles = async (page, size = 2) => {
  try {
    const response = await clientInstance.get("/user/saved-articles", {
      params: { page, size },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
  }
};

export const getArticleSavedStatus = async (articleId) => {
  try {
    const response = await clientInstance.get(
      `/user/is-article-saved/${articleId}`
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
  }
};
