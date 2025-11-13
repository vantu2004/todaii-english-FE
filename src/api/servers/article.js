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
