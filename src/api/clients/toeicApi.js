import { serverInstance } from "@/config/axios";

// Collections
export const fetchToeicCollections = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/toeic/collection", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getToeicCollectionById = async (id) => {
  try {
    const response = await serverInstanceInstance.get(`/toeic/collection/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Tests
export const fetchTestsByCollectionId = async (
  collectionId,
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get(
      `/toeic/test/collection/${collectionId}`,
      {
        params: { page, size, sortBy, direction, keyword },
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const fetchToeicTests = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/toeic/test", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getToeicTestById = async (id) => {
  try {
    const response = await serverInstance.get(`/toeic/test/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Questions and Passages
export const getQuestionsByPartNumber = async (testId, partNumber) => {
  try {
    const response = await serverInstance.get(
      `/toeic/test/${testId}/part/${partNumber}/question`
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getPassagesByPartNumber = async (testId, partNumber) => {
  try {
    const response = await serverInstance.get(
      `/toeic/test/${testId}/part/${partNumber}/passage`
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
