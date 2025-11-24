import { clientInstance } from "../../config/axios";

export const getVideoLyrics = async (videoId) => {
  try {
    const response = await clientInstance.get(`/video/${videoId}/lyric`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
