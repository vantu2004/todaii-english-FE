import { clientInstance } from "@/config/axios";

export const getAllTestsPaged = async (
  page,
  size,
  sortBy,
  direction,
  keyword,
) => {
  try {
    const response = await clientInstance.get(
      `/toeic/test?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&keyword=${keyword}`,
    );
    return response.data;
  } catch (err) {
    console.log("Error to get all tests paged:", err);
    throw err;
  }
};

export const getAllTestsByCollectionPaged = async (
  collectionId,
  page,
  size,
  sortBy,
  direction,
  keyword,
) => {
  try {
    const response = await clientInstance.get(
      `/toeic/test/collection/${collectionId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&keyword=${keyword}`,
    );
    return response.data;
  } catch (err) {
    console.log("Error to get all tests by collection paged:", err);
    throw err;
  }
};

export const getTestById = async (testId) => {
  try {
    const response = await clientInstance.get(`/toeic/test/${testId}`);
    return response.data;
  } catch (err) {
    console.log("Error to get test by id:", err);
    throw err;
  }
};

export const getSavedTestsByUser = async () => {
  try {
    const response = await clientInstance.get("/toeic/test/saved");
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const isSavedTest = async (testId) => {
  try {
    const response = await clientInstance.get(`/toeic/test/${testId}/is-saved`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
