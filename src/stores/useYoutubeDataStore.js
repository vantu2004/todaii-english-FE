import { create } from "zustand";

export const useYoutubeDataStore = create((set) => ({
  rawVideo: null,

  setRawVideo: (video) => set({ rawVideo: video }),

  clearRawVideo: () => set({ rawVideo: null }),
}));
