import { serverInstance } from "../../config/axios";

export const fetchSettings = async (category) => {
  try {
    const response = await serverInstance.get("/setting", {
      params: { category: category },
    });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};

export const updateSetting = async (key, value) => {
  try {
    await serverInstance.put(
      `/setting/${key}`,
      {},
      { params: { value: value } }
    );
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
