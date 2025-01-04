import { Sow } from "@/types/sow";
import { create } from "zustand";

interface SowState {
  sows: Sow[];
  editingSow: Sow | null;
  setSows: (sows: Sow[]) => void;
  setEditingSow: (sow: Sow | null) => void;
  updateSow: (sow: Sow) => void;
  addSow: (sow: Sow) => void;
  removeSow: (id: number) => void;
}

export const useSowStore = create<SowState>((set) => ({
  sows: [],
  editingSow: null,
  setSows: (sows: Sow[]) => set({ sows }),
  setEditingSow: (sow: Sow | null) => set({ editingSow: sow }),
  updateSow: (sow: Sow) =>
    set((state) => ({
      sows: state.sows.map((s) => (s.id === sow.id ? sow : s)),
    })),
  addSow: (sow: Sow) => set((state) => ({ sows: [sow, ...state.sows] })),
  removeSow: (id: number) =>
    set((state) => ({
      sows: state.sows.filter((sow) => sow.id !== id),
    })),
}));
