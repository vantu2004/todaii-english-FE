import { clientInstance } from "../../config/axios";

export const getVocabDeckById = async (id) => {
  try {
    const response = await clientInstance.get(`/vocab-deck/${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const filterVocabDecks = async (query) => {
  try {
    const response = await clientInstance.get("/vocab-deck/filter", {
      params: {
        keyword: query.keyword,
        cefrLevel: query.cefrLevel,
        alias: query.alias,
        page: query.page,
        size: query.size,
        sortBy: query.sortBy,
        direction: query.direction,
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
