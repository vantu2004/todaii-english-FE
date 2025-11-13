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
    console.error("Error fetching articles:", err);
  }
};

export const toggleArticle = async (articleId) => {
  try {
    await serverInstance.patch(`/article/${articleId}/enabled`);
  } catch (err) {
    console.error(
      `Error toggling enabled state for article ${articleId}:`,
      err
    );
  }
};
