"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useEffect,
} from "react";

import {
  useAuthStore,
} from "@/stores/auth-store";

export function ProtectedRoute({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const router =
    useRouter();

  const {
    hydrated,
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    if (
      hydrated &&
      !isAuthenticated
    ) {
      router.push(
        "/login"
      );
    }
  }, [
    hydrated,
    isAuthenticated,
    router,
  ]);

  if (!hydrated) {
    return null;
  }

  return children;
}