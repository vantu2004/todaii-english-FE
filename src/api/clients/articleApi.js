import { clientInstance } from "../../config/axios";
import { formatDate } from "../../utils/FormatDate";

export const getLastestArticles = async (size) => {
  try {
    const response = await clientInstance.get(`/article/latest?size=${size}`);
    return response.data;
  } catch (err) {
    console.error("Get latest articles error:", err);
    throw err;
  }
};

export const getTopArticles = async (size) => {
  try {
    const response = await clientInstance.get(`/article/top?size=${size}`);
    return response.data;
  } catch (err) {
    console.error("Get top articles error:", err);
    throw err;
  }
};

export const getArticleById = async (id) => {
  try {
    const response = await clientInstance.get(`/article/${id}`);
    return response.data;
  } catch (err) {
    console.error("Get top articles error:", err);
    throw err;
  }
};

export const getArticlesByDate = async (
  date,
  page = 1,
  size = 5,
  sortBy = "id",
  direction = "asc",
  keyword = ""
) => {
  try {
    const formattedDate = typeof date === "string" ? date : formatDate(date);
    const response = await clientInstance.get(
      `/article/by-date/${formattedDate}`,
      {
        params: { page, size, sortBy, direction, keyword },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Get articles by date error:", err);
    throw err;
  }
};

export const searchArticles = async (
  keyword,
  page,
  size,
  sortBy,
  direction = "desc"
) => {
  try {
    const response = await clientInstance.get(`/article/search`, {
      params: {
        page,
        size,
        sortBy,
        direction,
        keyword,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Search articles error:", err);
    throw err;
  }
};

export const filterArticles = async ({
  keyword = "",
  sourceName = "",
  alias = "",
  cefrLevel = "",
  minViews = 0,
  page = 1,
  size = 5,
  sortBy = "id",
  direction = "desc",
}) => {
  try {
    const response = await clientInstance.get(`/article/filter`, {
      params: {
        keyword,
        sourceName,
        alias,
        cefrLevel,
        minViews,
        page,
        size,
        sortBy,
        direction,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Filter articles error:", err);
    throw err;
  }
};

export const getAllSources = async () => {
  try {
    const response = await clientInstance.get(`/article/source`);
    return response.data;
  } catch (err) {
    console.error("Get all sources error:", err);
    throw err;
  }
};

export const saveArticle = async (articleId) => {
  try {
    const response = await clientInstance.post(`article/bookmark/${articleId}`);
    return response.data;
  } catch (err) {
    console.error("Save article error:", err);
    throw err;
  }
};

export const unsavedArticle = async (articleId) => {
  try {
    const response = await clientInstance.delete(
      `article/bookmark/${articleId}`
    );
    return response.data;
  } catch (err) {
    console.error("Unsaved article error:", err);
    throw err;
  }
};
