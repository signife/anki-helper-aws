import { create } from "zustand";

interface BatchState {
  selectedCardIds: string[];
  isProcessing: boolean;
  currentIndex: number;
  totalCount: number;
  toggleCardSelection: (cardId: string) => void;
  clearSelection: () => void;
  setProcessing: (processing: boolean) => void;
  setProgress: (current: number, total: number) => void;
}

export const useBatchStore = create<BatchState>((set) => ({
  selectedCardIds: [],
  isProcessing: false,
  currentIndex: 0,
  totalCount: 0,
  toggleCardSelection: (cardId) =>
    set((state) => ({
      selectedCardIds: state.selectedCardIds.includes(cardId)
        ? state.selectedCardIds.filter((id) => id !== cardId)
        : [...state.selectedCardIds, cardId],
    })),
  clearSelection: () => set({ selectedCardIds: [] }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setProgress: (current, total) =>
    set({ currentIndex: current, totalCount: total }),
}));
