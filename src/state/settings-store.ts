import { create } from 'zustand';

interface SettingsState {
  selectedOriginId: string | null;
  threshold: number;
  setSelectedOriginId: (id: string | null) => void;
  setThreshold: (value: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  selectedOriginId: null,
  threshold: 6,
  setSelectedOriginId: (id) => set({ selectedOriginId: id }),
  setThreshold: (value) => set({ threshold: value }),
}));
