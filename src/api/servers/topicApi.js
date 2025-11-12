import { serverInstance } from "../../config/axios";

export const fetchTopics = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = "",
  topicType = "article"
) => {
  try {
    // get nhận tham số query ở tham số thứ 2
    const response = await serverInstance.get("/topic", {
      params: { page, size, sortBy, direction, keyword, topicType },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
  }
};

export const createTopic = async (data) => {
  try {
    await serverInstance.post("/topic", {
      name: data.name,
      topic_type: data.topicType,
    });
  } catch (err) {
    throw err;
  }
};

export const updateTopic = async (topicId, data) => {
  try {
    // put nhận body ở tham số thứ 2 và query ở tham số thứ 3
    await serverInstance.put(`/topic/${topicId}`, null, {
      // body = null
      params: { name: data.name }, // gửi qua query
    });
  } catch (err) {
    throw err;
  }
};

export const toggleTopic = async (topicId) => {
  try {
    await serverInstance.patch(`/topic/${topicId}/enabled`);
  } catch (err) {
    console.error(`Error toggling enabled state for topic ${topicId}:`, err);
  }
};

export const deleteTopic = async (topicId) => {
  try {
    await serverInstance.delete(`/topic/${topicId}`);
  } catch (err) {
    console.error(`Error deleting topic ${topicId}:`, err);
  }
};
