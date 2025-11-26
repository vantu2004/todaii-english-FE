import { clientInstance } from "../../config/axios";

export const getNotebooks = async (noteId) => {
  try {
    const response = await clientInstance.get(`/notebook/${noteId}/words`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const addWordToNotebook = async (noteId, entryId) => {
  try {
    await clientInstance.post(`/notebook/${noteId}/word/${entryId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const removeWordFromNotebook = async (noteId, entryId) => {
  try {
    await clientInstance.delete(`/notebook/${noteId}/word/${entryId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
