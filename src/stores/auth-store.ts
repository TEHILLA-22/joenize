import { create } from "zustand";

import type { User } from "@/types/auth";

interface AuthStore {
  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  hydrated: boolean;

  setUser: (
    user: User | null
  ) => void;

  setAccessToken: (
    token: string | null
  ) => void;

  setHydrated: (
    hydrated: boolean
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: null,

    accessToken: null,

    hydrated: false,

    isAuthenticated: false,

    setUser: (user) =>
      set({
        user,
      }),

    setAccessToken: (
      token
    ) =>
      set({
        accessToken: token,
        isAuthenticated:
          !!token,
      }),

    setHydrated: (
      hydrated
    ) =>
      set({
        hydrated,
      }),

    logout: () =>
      set({
        user: null,
        accessToken: null,
        hydrated: true,
        isAuthenticated: false,
      }),
  }));