import { clientInstance } from "@/config/axios";

export const getHistoryMessages = async (page = 1, size = 10) => {
  try {
    const response = await clientInstance.get("/chatbot", {
      params: {
        page,
        size,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Get history messages error:", err);
    throw err;
  }
};

export const sendMessageStream = async function* (message, aiProvider) {
  try {
    const response = await clientInstance.post("/chatbot", null, {
      params: {
        message,
        aiProvider,
      },
    });

    const text =
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);

    // fake streaming
    const words = text.split(" ");

    for (const word of words) {
      yield word + " ";

      // delay giả lập typing
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  } catch (err) {
    console.error("Send message stream error:", err);

    throw err;
  }
};

export const deleteHistoryMessages = async () => {
  try {
    const response = await clientInstance.delete("/chatbot");

    return response.data;
  } catch (err) {
    console.error("Delete history messages error:", err);
    throw err;
  }
};
