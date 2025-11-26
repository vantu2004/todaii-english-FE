import { clientInstance } from "../../config/axios";

export const getAllNotebooks = async () => {
  try {
    const response = await clientInstance.get("/notebook");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createNotebook = async (notebookData) => {
  try {
    const response = await clientInstance.post("/notebook", notebookData);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const renameNotebook = async (notebookId, newName) => {
  try {
    const response = await clientInstance.put(`/notebook/${notebookId}`, {
      name: newName,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteNotebook = async (notebookId) => {
  try {
    await clientInstance.delete(`/notebook/${notebookId}`);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
