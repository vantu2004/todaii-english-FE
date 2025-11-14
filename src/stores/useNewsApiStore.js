import { create } from "zustand";

export const useNewsApiStore = create((set) => ({
  rawArticle: null,

  setRawArticle: (article) => set({ rawArticle: article }),

  clearRawArticle: () => set({ rawArticle: null }),
}));
