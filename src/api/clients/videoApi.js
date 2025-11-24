import { clientInstance } from "../../config/axios";
import { formatDate } from "../../utils/FormatDate";

export const getLatestVideos = async (size = 10) => {
  try {
    const response = await clientInstance.get(`/video/latest?size=${size}`);
    return response.data;
  } catch (err) {
    console.error("Get latest videos error:", err);
    throw err;
  }
};

export const getTopVideos = async (size = 10) => {
  try {
    const response = await clientInstance.get(`/video/top?size=${size}`);
    return response.data;
  } catch (err) {
    console.error("Get top videos error:", err);
    throw err;
  }
};

export const getVideoById = async (id) => {
  try {
    const response = await clientInstance.get(`/video/${id}`);
    return response.data;
  } catch (err) {
    console.error("Get video by id error:", err);
    throw err;
  }
};

export const getRelatedVideos = async (videoId) => {
  try {
    const response = await clientInstance.get(`/video/${videoId}/related`);
    return response.data;
  } catch (err) {
    console.error("Get related videos error:", err);
    throw err;
  }
};

export const getVideosByDate = async (
  date,
  page = 1,
  size = 10,
  sortBy = "createdAt",
  direction = "desc"
) => {
  try {
    const formattedDate = typeof date === "string" ? date : formatDate(date);
    const response = await clientInstance.get(
      `/video/by-date/${formattedDate}`,
      {
        params: { page, size, sortBy, direction },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Get videos by date error:", err);
    throw err;
  }
};

export const filterVideos = async ({
  keyword = "",
  cefrLevel = "",
  minViews = 0,
  alias = "",
  page = 1,
  size = 5,
  sortBy = "id",
  direction = "desc",
}) => {
  try {
    const response = await clientInstance.get(`/video/filter`, {
      params: {
        keyword,
        cefrLevel,
        minViews,
        alias,
        page,
        size,
        sortBy,
        direction,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Filter videos error:", err);
    throw err;
  }
};

export const getSavedVideosByUser = async () => {
  try {
    const response = await clientInstance.get("/video/saved");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const isSavedVideo = async (videoId) => {
  try {
    const response = await clientInstance.get(`/video/${videoId}/is-saved`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
