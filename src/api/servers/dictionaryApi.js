import { serverInstance } from "../../config/axios";

export const fetchDictionary = async (
  page = 1,
  size = 20,
  sortBy = "headword",
  direction = "asc",
  keyword = ""
) => {
  try {
    const response = await serverInstance.get("/dictionary", {
      params: { page, size, sortBy, direction, keyword },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
  }
};
