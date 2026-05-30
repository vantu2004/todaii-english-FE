import { clientInstance } from "@/config/axios";
import { formatDate } from "@/utils/FormatDate";

export const getMyChart = async (startDate, endDate) => {
  try {
    const response = await clientInstance.get("/dashboard/my-chart", {
      params: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching client dashboard data:", error);
    throw error;
  }
};
