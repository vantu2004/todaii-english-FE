import { clientInstance } from "@/config/axios";

export const getPassageByPartNumber = async (testId, partNumber) => {
  try {
    const response = await clientInstance.get(
      `/toeic/test/${testId}/part/${partNumber}/passage`,
    );
    return response.data;
  } catch (err) {
    console.log("Error to get passage by part number:", err);
    throw err;
  }
};
