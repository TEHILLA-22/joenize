import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export async function performLogout(): Promise<void> {
  try {
    await logout();
  } finally {
    useAuthStore
      .getState()
      .logout();
  }
}