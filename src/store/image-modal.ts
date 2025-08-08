import { create } from 'zustand';

export type ImageModalTab = 'collection' | 'upload' | 'url';

interface ImageModalState {
  isOpen: boolean;
  activeTab: ImageModalTab;
  openModal: () => void;
  closeModal: () => void;
  setActiveTab: (tab: ImageModalTab) => void;
}

export const useImageModal = create<ImageModalState>((set) => ({
  isOpen: false,
  activeTab: 'collection',
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));