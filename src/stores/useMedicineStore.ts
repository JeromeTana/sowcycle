import { Medicine } from "@/types/medicine";
import { create } from "zustand";

interface MedicineState {
  medicines: Medicine[];
  medicine: Medicine;
  setMedicines: (medicines: Medicine[]) => void;
  setMedicine: (medicine: Medicine) => void;
  updateMedicine: (medicine: Medicine) => void;
  addMedicine: (medicine: Medicine) => void;
  removeMedicine: (id: number) => void;
}

export const useMedicineStore = create<MedicineState>((set) => ({
  medicines: [],
  medicine: {} as Medicine,
  setMedicines: (medicines: Medicine[]) => set({ medicines }),
  setMedicine: (medicine: Medicine) => set({ medicine }),
  updateMedicine: (medicine: Medicine) =>
    set((state) => ({
      medicine,
      medicines: state.medicines.map((s) => (s.id === medicine.id ? medicine : s)),
    })),
  addMedicine: (medicine: Medicine) => set((state) => ({ medicines: [medicine, ...state.medicines] })),
  removeMedicine: (id: number) =>
    set((state) => ({
      medicines: state.medicines.filter((medicine) => medicine.id !== id),
    })),
}));
