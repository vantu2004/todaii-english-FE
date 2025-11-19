import { serverInstance } from "../../config/axios";

export const fetchArticlesFromNewsApi = async (
  query = "technology",
  pageSize = 10,
  page = 1,
  sortBy = "publishedAt"
) => {
  try {
    const response = await serverInstance.post(
      "/article/news-api",
      {},
      {
        params: { query, pageSize, page, sortBy },
      }
    );
    return response.data.articles;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchArticles = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/article", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchArticlesByTopic = async (
  topicId,
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get(`/article/topic/${topicId}`, {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchArticle = async (articleId) => {
  try {
    const response = await serverInstance.get(`/article/${articleId}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createArticle = async (data) => {
  try {
    await serverInstance.post("/article", data);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateArticle = async (articleId, data) => {
  try {
    await serverInstance.put(`/article/${articleId}`, data);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const toggleArticle = async (articleId) => {
  try {
    await serverInstance.patch(`/article/${articleId}/enabled`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    await serverInstance.delete(`/article/${articleId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const addWordToArticle = async (articleId, wordId) => {
  try {
    await serverInstance.post(`/article/${articleId}/word/${wordId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteWordFromArticle = async (articleId, wordId) => {
  try {
    await serverInstance.delete(`/article/${articleId}/word/${wordId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteAllWordsFromArticle = async (articleId) => {
  try {
    await serverInstance.delete(`/article/${articleId}/word`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
