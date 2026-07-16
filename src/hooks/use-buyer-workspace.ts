"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getBuyerWorkspaceSummary,
} from "@/services/buyer-workspace.service";
import {
  useAuthStore,
} from "@/stores/auth-store";

export function useBuyerWorkspace() {
  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  return useQuery({
    queryKey: [
      "buyer-workspace-summary",
    ],
    queryFn:
      getBuyerWorkspaceSummary,
    enabled: isAuthenticated,
  });
}
