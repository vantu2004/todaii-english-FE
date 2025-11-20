import { clientInstance } from "../../config/axios";
import { serverInstance } from "../../config/axios";

export const getRawWord = async (searchTerm) => {
  try {
    const response = await serverInstance.get(
      `/dictionary/raw-word?word=${searchTerm}`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
