import { create } from "zustand";

interface AnkiState {
  connectionStatus: "idle" | "connected" | "error" | "loading";
  ankiUrl: string;
  setConnectionStatus: (status: AnkiState["connectionStatus"]) => void;
  setAnkiUrl: (url: string) => void;
}

export const useAnkiStore = create<AnkiState>((set) => ({
  connectionStatus: "idle",
  ankiUrl: "http://localhost:8765",
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setAnkiUrl: (url) => set({ ankiUrl: url }),
}));
