import { apiClient } from "@/lib/api/client";

import type {
  LoginRequest,
  LoginResponse,
  GoogleLoginRequest,
  GoogleLoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from "@/types/auth";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api";

export function getBackendOrigin(): string {
  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return "http://localhost:8000";
  }
}

export function getGoogleAuthUrl(): string {
  const url = new URL(
    "/auth/google",
    getBackendOrigin()
  );

  url.searchParams.set(
    "process",
    "login"
  );

  if (typeof window !== "undefined") {
    url.searchParams.set(
      "next",
      `${window.location.origin}/dashboard`
    );
  }

  return url.toString();
}

export async function googleLogin(
  payload: GoogleLoginRequest
): Promise<GoogleLoginResponse> {
  const response =
    await apiClient.post<GoogleLoginResponse>(
      "/auth/google",
      payload
    );

  return response.data;
}

export async function login(
  payload: LoginRequest
): Promise<LoginResponse> {
  const response =
    await apiClient.post<LoginResponse>(
      "/auth/login",
      payload
    );

  return response.data;
}


export async function register(
  payload: RegisterRequest
): Promise<RegisterResponse> {
  const response =
    await apiClient.post<RegisterResponse>(
      "/auth/register",
      payload
    );

  return response.data;
}


export async function verifyEmail(
  token: string
) {
  const response =
    await apiClient.post(
      "/auth/verify-email",
      {
        token,
      }
    );

  return response.data;
}


export async function logout(): Promise<void> {
  await apiClient.post(
    "/auth/logout"
  );
}


export async function refreshToken(): Promise<{
  access: string;
  refresh_token?: string;
}> {
  const authStore = (await import("@/stores/auth-store")).useAuthStore;
  const refreshTokenValue = authStore.getState().refreshToken;

  const response = await apiClient.post(
    "/auth/refresh",
    refreshTokenValue ? { refresh_token: refreshTokenValue } : undefined
  );

  return response.data;
}


export async function me(): Promise<User> {
  const response =
    await apiClient.get<User>(
      "/auth/me"
    );

  return response.data;
}
