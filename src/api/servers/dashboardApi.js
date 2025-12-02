import { serverInstance } from "../../config/axios";
import { formatDate } from "../../utils/FormatDate";

export const getSummary = async () => {
  try {
    const response = await serverInstance.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const getAdminDashboard = async (startDate, endDate) => {
  try {
    const response = await serverInstance.get("/dashboard/admin-chart", {
      params: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const getUserChart = async (startDate, endDate) => {
  try {
    const response = await serverInstance.get("/dashboard/user-chart", {
      params: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
