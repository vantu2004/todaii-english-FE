import { serverInstance } from "../../config/axios";

export const fetchVideoByUrl = async (url) => {
  try {
    const response = await serverInstance.get(`/video/youtube?url=${url}`);
    return response.data;
  } catch (error) {
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
  } catch (error) {
    console.error("Error:", err);
    throw err;
  }
};
