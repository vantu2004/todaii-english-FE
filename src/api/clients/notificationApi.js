import { clientInstance } from "@/config/axios";

export const getNotifications = async () => {
  try {
    const response = await clientInstance.get("/notification");
    return response.data;
  } catch (err) {
    console.error("Get notifications error:", err);
    throw err;
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await clientInstance.get("/notification/unread-count");
    return response.data; // returns raw number
  } catch (err) {
    console.error("Get unread notifications count error:", err);
    throw err;
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await clientInstance.put(`/notification/${id}/read`);
    return response.data;
  } catch (err) {
    console.error(`Mark notification ${id} as read error:`, err);
    throw err;
  }
};
