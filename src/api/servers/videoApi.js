import { serverInstance } from "../../config/axios";

export const fetchVideoByUrl = async (url) => {
  try {
    const response = await serverInstance.get(`/video/youtube?url=${url}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchVideoByKeyword = async (keyword, type, size) => {
  try {
    const response = await serverInstance.get("/video/youtube-data-api-v3", {
      params: { keyword, type, size },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchVideos = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/video", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchVideosByTopic = async (
  topicId,
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get(`/video/topic/${topicId}`, {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchVideo = async (videoId) => {
  try {
    const response = await serverInstance.get(`/video/${videoId}`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createVideo = async (video) => {
  try {
    await serverInstance.post("/video", video);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateVideo = async (videoId, video) => {
  try {
    await serverInstance.put(`/video/${videoId}`, video);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const toggleVideo = async (videoId) => {
  try {
    await serverInstance.patch(`/video/${videoId}/enabled`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteVideo = async (videoId) => {
  try {
    await serverInstance.delete(`/video/${videoId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
