import { clientInstance } from "@/config/axios";

export const translateText = async ({
  sourceLanguage,
  targetLanguage,
  texts,
}) => {
  try {
    const response = await clientInstance.post("/gg-translate", {
      source_language: sourceLanguage,
      target_language: targetLanguage,
      texts,
    });

    return response.data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
