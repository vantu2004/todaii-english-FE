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

export const createNotebook = async ({ name, type, parentId }) => {
  try {
    const payload = {
      name,
      type,
      parent_id: parentId,
    };
    const response = await clientInstance.post("/notebook", payload);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const renameNotebook = async (notebookId, newName) => {
  try {
    const response = await clientInstance.put(
      `/notebook/${notebookId}`,
      {},
      {
        params: { name: newName },
      }
    );
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
