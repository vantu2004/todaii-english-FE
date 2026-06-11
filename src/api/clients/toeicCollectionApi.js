import { clientInstance } from "@/config/axios";

export const getAllCollections = async () => {
  try {
    const response = await clientInstance.get("/toeic/collection");
    return response.data;
  } catch (err) {
    console.log("Error to get all collections:", err);
    throw err;
  }
};
