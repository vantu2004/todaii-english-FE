import { serverInstance } from "../../config/axios";

export const fetchVocabGroupsNoPaged = async () => {
  try {
    const response = await serverInstance.get("/vocab-group/no-paged");
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const fetchVocabGroups = async (
  page = 1,
  size = 10,
  sortBy = "id",
  direction = "desc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/vocab-group", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const createVocabGroup = async (data) => {
  try {
    await serverInstance.post(
      "/vocab-group",
      {},
      {
        params: { name: data },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateVocabGroup = async (vocabGroupId, data) => {
  try {
    await serverInstance.put(
      `/vocab-group/${vocabGroupId}`,
      {},
      {
        params: { name: data },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const toggleVocabGroup = async (vocabGroupId) => {
  try {
    await serverInstance.patch(`/vocab-group/${vocabGroupId}/enabled`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const deleteVocabGroup = async (vocabGroupId) => {
  try {
    await serverInstance.delete(`/vocab-group/${vocabGroupId}`);
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
