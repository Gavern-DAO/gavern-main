// @/store/auth.ts
import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;

  // Modal states
  successfulWalletModalOpen: boolean;
  setSuccessfulWalletModalOpen: (value: boolean) => void;

  daosFoundModalOpen: boolean;
  setDaosFoundModalOpen: (value: boolean) => void;

  countdown: number;
  setCountdown: (value: number) => void;

  // ✅ ADD: Reset function to clear all auth state
  resetAuthState: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  successfulWalletModalOpen: false,
  setSuccessfulWalletModalOpen: (value) =>
    set({ successfulWalletModalOpen: value }),

  daosFoundModalOpen: false,
  setDaosFoundModalOpen: (value) => set({ daosFoundModalOpen: value }),

  countdown: 10,
  setCountdown: (value) => set({ countdown: value }),

  // ✅ Reset all auth-related state
  resetAuthState: () =>
    set({
      isAuthenticated: false,
      successfulWalletModalOpen: false,
      daosFoundModalOpen: false,
      countdown: 10,
    }),
}));