import { serverInstance } from "../../config/axios";

export const fetchVideoFromYoutube = async (url) => {
  try {
    const response = await serverInstance.get(`/video/youtube?url=${url}`);
    return response.data;
  } catch (error) {
    console.error("Error:", err);
    throw err;
  }
};
