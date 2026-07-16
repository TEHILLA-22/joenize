import { apiClient } from "./client";

import { useAuthStore } from "@/stores/auth-store";

apiClient.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState()
        .accessToken;

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);