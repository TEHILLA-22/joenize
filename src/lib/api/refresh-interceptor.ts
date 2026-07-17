import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import { apiClient } from "./client";

import { refreshToken } from "@/services/auth.service";

import { useAuthStore } from "@/stores/auth-store";

let refreshPromise:
  | Promise<string>
  | null = null;

type RetriableRequestConfig =
  InternalAxiosRequestConfig & {
    _retry?: boolean;
    _retryCount?: number;
  };

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | RetriableRequestConfig
        | undefined;

    if (
      error.response?.status !==
      401
    ) {
      return Promise.reject(
        error
      );
    }

    if (!originalRequest) {
      return Promise.reject(
        error
      );
    }

    if (
      originalRequest.url?.includes(
        "/auth/refresh"
      )
    ) {
      useAuthStore
        .getState()
        .logout();

      return Promise.reject(
        error
      );
    }

    if (
      originalRequest._retry
    ) {
      return Promise.reject(
        error
      );
    }

    originalRequest._retry =
      true;

    try {
      if (!refreshPromise) {
        refreshPromise =
          refreshToken().then(
            (response) => {
              useAuthStore
                .getState()
                .setAccessToken(
                  response.access
                );

              if (response.refresh_token) {
                useAuthStore
                  .getState()
                  .setRefreshToken(
                    response.refresh_token
                  );
              }

              return (
                response.access
              );
            }
          );
      }

      const token =
        await refreshPromise;

      refreshPromise =
        null;

      originalRequest.headers.set(
        "Authorization",
        `Bearer ${token}`
      );

      return apiClient(
        originalRequest
      );
    } catch (err) {
      refreshPromise = null;

      useAuthStore
        .getState()
        .logout();

      return Promise.reject(
        err
      );
    }
  }
);
