import { serverInstance } from "../../config/axios";

export const importSrtFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await serverInstance.post(
      "/video/lyric/import",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchLyrics = async (videoId) => {
  try {
    const response = await serverInstance.get(`/video/${videoId}/lyric`);
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createLyricBatch = async (videoId, lyrics) => {
  try {
    serverInstance.post(`/video/${videoId}/lyric`, lyrics);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateLyric = async (lyricId, lyric) => {
  try {
    await serverInstance.put(`/video/lyric/${lyricId}`, lyric);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteLyric = async (lyricId) => {
  try {
    await serverInstance.delete(`/video/lyric/${lyricId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteAllLyrics = async (videoId) => {
  try {
    await serverInstance.delete(`/video/${videoId}/lyric`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
