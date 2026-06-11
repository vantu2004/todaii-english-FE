/**
 * Robust utility to parse DictionaryWord entity returned from API.
 * Safely extracts fields like id, word text, ipa, and audio_url.
 */
export const parseDictionaryWord = (word) => {
  if (!word) return { id: null, word: "", ipa: "", audio_url: "" };

  const id = word.id || word.word_id;
  const wordText = word.word || word.headword || word.head_word || "";
  let ipa = word.ipa || word.phonetic || "";
  let audio_url = word.audio_url || "";

  const jsonString = word.json_data || word.jsonData;
  if (jsonString) {
    try {
      const parsed =
        typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
      const result = parsed?.result?.[0];
      if (result) {
        if (!ipa) {
          ipa =
            result.pronounce?.base ||
            result.pronounce?.us ||
            result.pronounce?.gb ||
            "";
        }
        if (!audio_url) {
          audio_url =
            result.pronounce?.us_audio ||
            result.pronounce?.gb_audio ||
            result.pronounce?.base_audio ||
            "";
        }
      }
    } catch (e) {
      console.error("Error parsing jsonData", e);
    }
  }

  return { id, word: wordText, ipa, audio_url };
};
