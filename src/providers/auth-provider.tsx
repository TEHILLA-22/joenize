"use client";

import {
  useEffect,
} from "react";

import {
  refreshToken,
  me,
} from "@/services/auth.service";

import {
  useAuthStore,
} from "@/stores/auth-store";

export function AuthProvider({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const setUser =
    useAuthStore(
      (s) => s.setUser
    );

  const setToken =
    useAuthStore(
      (s) =>
        s.setAccessToken
    );

  const setHydrated =
    useAuthStore(
      (s) =>
        s.setHydrated
    );

  useEffect(() => {
    async function hydrate() {
      try {
        const refresh =
          await refreshToken();

        setToken(
          refresh.access
        );

        const user =
          await me();

        setUser(user);
      } catch {
      } finally {
        setHydrated(true);
      }
    }

    hydrate();
  }, [
    setUser,
    setToken,
    setHydrated,
  ]);

  return children;
}