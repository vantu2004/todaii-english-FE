import { clientInstance } from "../../config/axios";

export const getVocabGroups = async () => {
  try {
    const response = await clientInstance.get("/vocab-group");
    return response.data;
  } catch (err) {
    throw err;
  }
};
